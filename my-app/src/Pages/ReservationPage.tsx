import { useState, useEffect } from 'react'
import { Formik, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';

interface ReservationFormValues {
    name: string;
    startTime: string;
    endTime: string;
    phone: string;
    amountOfPersons: number;
}

interface RestaurantTable {
    tableId?: string;
    TableId?: string;
    chairs?: number;
    Chairs?: number;
}

interface Reservation {
    reservationId?: string;
    ReservationId?: string;
    startingTime?: string;
    StartingTime?: string;
    endingTime?: string;
    EndingTime?: string;
    amountOfPersons?: number;
    AmountOfPersons?: number;
    phoneNumber?: string;
    PhoneNumber?: string;
    nameofPerson?: string;
    NameofPerson?: string;
    restaurantTable: RestaurantTable;
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

function getTableId(table: RestaurantTable): string {
    return table.tableId ?? table.TableId ?? '';
}

function getChairs(table: RestaurantTable): number | undefined {
    return table.chairs ?? table.Chairs;
}

function getReservationId(reservation: Reservation): string {
    return reservation.reservationId ?? reservation.ReservationId ?? '';
}

function getStartingTime(reservation: Reservation): string {
    return reservation.startingTime ?? reservation.StartingTime ?? '';
}

function getEndingTime(reservation: Reservation): string {
    return reservation.endingTime ?? reservation.EndingTime ?? '';
}

function toBackendDateTime(value: string): string {
    return value.length === 16 ? `${value}:00` : value;
}

function formatReservationTime(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return `${start} - ${end}`;
    }

    const date = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(startDate);
    const time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${date} | ${time.format(startDate)} - ${time.format(endDate)}`;
}

function hasValidTimeRange(start: string, end: string): boolean {
    return Boolean(start && end && new Date(start).getTime() < new Date(end).getTime());
}

async function isTableAvailable(table: RestaurantTable, start: string, end: string): Promise<boolean> {
    const params = new URLSearchParams({
        start: toBackendDateTime(start),
        end: toBackendDateTime(end),
    });
    const response = await fetch(`http://localhost:8080/tables?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Availability check failed with ${response.status} ${response.statusText}`);
    }

    const availableTables = await response.json() as RestaurantTable[];
    const selectedTableId = getTableId(table);

    return availableTables.some((availableTable) => getTableId(availableTable) === selectedTableId);
}

function ReservationAvailabilityCheck({
    startTime,
    endTime,
    selectedTable,
    onStatusChange,
}: {
    startTime: string;
    endTime: string;
    selectedTable: RestaurantTable;
    onStatusChange: (status: AvailabilityStatus) => void;
}) {
    useEffect(() => {
        let isCurrentCheck = true;

        if (!hasValidTimeRange(startTime, endTime)) {
            onStatusChange('idle');
            return;
        }

        onStatusChange('checking');

        const timeoutId = window.setTimeout(async () => {
            try {
                const available = await isTableAvailable(selectedTable, startTime, endTime);

                if (isCurrentCheck) {
                    onStatusChange(available ? 'available' : 'unavailable');
                }
            } catch (error) {
                if (isCurrentCheck) {
                    onStatusChange('error');
                }
                console.error("Availability check fehlgeschlagen:", error);
            }
        }, 300);

        return () => {
            isCurrentCheck = false;
            window.clearTimeout(timeoutId);
        };
    }, [startTime, endTime, selectedTable, onStatusChange]);

    return null;
}

function getAvailabilityMessage(status: AvailabilityStatus): string {
    if (status === 'checking') return 'Checking table availability...';
    if (status === 'available') return 'This table is available for the selected time.';
    if (status === 'unavailable') return 'This table is already booked at the selected time.';
    if (status === 'error') return 'Could not check availability. Please try again.';
    return 'Enter a valid start and end time to check availability.';
}

function ReservationPage() {
    const initialValues: ReservationFormValues = {
    name: "Max Muster",
    startTime: '2026-06-13T18:00',
    endTime: '2026-06-13T20:00',
    phone: '0791234567',
    amountOfPersons: 2,
  };

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [reservationFeedback, setReservationFeedback] = useState<string>('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle');

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8080/reservations");
            const data = await response.json();
            setReservations(data);

            const tablesResponse = await fetch("http://localhost:8080/tables");
            const tablesData = await tablesResponse.json();
            setTables(tablesData);
        } catch (error) {
            console.error("Fetch fehlgeschlagen:", error);
        }
    };
    fetchData();
}, []);


    const handleSubmit = async (
        values: ReservationFormValues,
        { setSubmitting }: FormikHelpers<ReservationFormValues>
    ) => {
        if (!selectedTable) return;
        setReservationFeedback('Submitting reservation...');
        setSubmitting(true);

        const reservation = {
            startingTime: toBackendDateTime(values.startTime),
            endingTime: toBackendDateTime(values.endTime),
            amountOfPersons: Number(values.amountOfPersons),
            phoneNumber: values.phone,
            nameofPerson: values.name,
            restaurantTable: {
                tableId: getTableId(selectedTable),
            },
        };
        const temporaryReservationId = crypto.randomUUID();

        try {
            const tableAvailable = await isTableAvailable(selectedTable, values.startTime, values.endTime);

            if (!tableAvailable) {
                setAvailabilityStatus('unavailable');
                setReservationFeedback('This table is not available at the selected time.');
                return;
            }

            const response = await fetch("http://localhost:8080/reservations", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reservation),
            });
            if (response.ok){
                setReservationFeedback('Reservation submitted successfully.');
                setAvailabilityStatus('idle');
                setSelectedTable(null);
                setReservations((currentReservations) => [
                    ...currentReservations,
                    {
                        ReservationId: temporaryReservationId,
                        reservationId: temporaryReservationId,
                        StartingTime: reservation.startingTime,
                        startingTime: reservation.startingTime,
                        EndingTime: reservation.endingTime,
                        endingTime: reservation.endingTime,
                        AmountOfPersons: reservation.amountOfPersons,
                        amountOfPersons: reservation.amountOfPersons,
                        PhoneNumber: reservation.phoneNumber,
                        phoneNumber: reservation.phoneNumber,
                        NameofPerson: reservation.nameofPerson,
                        nameofPerson: reservation.nameofPerson,
                        restaurantTable: selectedTable,
                    },
                ]);
            } else {
                setReservationFeedback(`Reservation failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setReservationFeedback('Reservation failed. Please try again.');
            console.error("Reservation fehlgeschlagen:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="reservation-page">
            {selectedTable === null ? (
                <>
                    <header className="page-header">
                        <p className="eyebrow">Table booking</p>
                        <h1>Reservations</h1>
                    </header>
                    {reservationFeedback && (
                        <p className="feedback-message" role="status">{reservationFeedback}</p>
                    )}
                    <section className="reservation-section">
                        <div className="section-heading">
                            <h2>Available tables</h2>
                            <p>Select a table to make a reservation.</p>
                        </div>
                        {tables.length === 0 ? (
                            <p className="empty-state">No tables available</p>
                        ) : (
                            <div className="table-grid">
                                {tables.map((table, index) => {
                                    const tableId = getTableId(table);

                                    return (
                                        <article className="table-card" key={tableId}>
                                            <div>
                                                <span className="card-label">Table</span>
                                                <strong>{index + 1}</strong>
                                            </div>
                                            <p className="chair-count">{getChairs(table) ?? '?'} chairs</p>
                                            <button onClick={() => {
                                                setReservationFeedback('');
                                                setAvailabilityStatus('idle');
                                                setSelectedTable(table);
                                            }}>
                                                Make Reservation
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section className="reservation-section">
                        <div className="section-heading">
                            <h2>Booked reservations</h2>
                            <p>Current reservations</p>
                        </div>
                        {reservations.length === 0 ? (
                            <p className="empty-state">No reservations booked yet.</p>
                        ) : (
                            <div className="reservation-list">
                                {reservations.map((res) => {
                                    const reservationId = getReservationId(res);
                                    const tableId = getTableId(res.restaurantTable);
                                    const start = getStartingTime(res);
                                    const end = getEndingTime(res);
                                    const tableIndex = tables.findIndex(t => getTableId(t) === tableId);

                                    return (
                                        <article className="reservation-item" key={reservationId}>
                                            <div>
                                                <span className="card-label">Table</span>
                                                <strong>{tableIndex >= 0 ? tableIndex + 1 : '?'}</strong>
                                            </div>
                                            <time dateTime={start}>{formatReservationTime(start, end)}</time>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </>
            ) : (
                <section className="reservation-form-panel">
                    <button className="secondary-button" onClick={() => {
                        setAvailabilityStatus('idle');
                        setSelectedTable(null);
                    }}>Back</button>
                    <header className="page-header">
                        <p className="eyebrow">Selected table</p>
                        <h1>Table {tables.findIndex(t => getTableId(t) === getTableId(selectedTable)) + 1}</h1>
                    </header>
                    {reservationFeedback && (
                        <p className="feedback-message" role="status">{reservationFeedback}</p>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors: Partial<Record<keyof ReservationFormValues, string>> = {};
                            if (!values.startTime) errors.startTime = 'Required';
                            if (!values.endTime)   errors.endTime   = 'Required';
                            if (!values.name)      errors.name      = 'Required';
                            if (!values.phone)     errors.phone     = 'Required';
                            if (!values.amountOfPersons) errors.amountOfPersons = 'Required';
                            if (values.startTime && values.endTime && !hasValidTimeRange(values.startTime, values.endTime)) {
                                errors.endTime = 'End time must be after start time';
                            }
                            return errors;
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, isSubmitting, values }) => (
                            <form className="reservation-form" onSubmit={handleSubmit}>
                                <ReservationAvailabilityCheck
                                    startTime={values.startTime}
                                    endTime={values.endTime}
                                    selectedTable={selectedTable}
                                    onStatusChange={setAvailabilityStatus}
                                />
                                <div className="form-field">
                                    <label>From</label>
                                    <Field type="datetime-local" name="startTime" />
                                    <ErrorMessage className="field-error" component="span" name="startTime" />
                                </div>
                                <div className="form-field">
                                    <label>To</label>
                                    <Field type="datetime-local" name="endTime" />
                                    <ErrorMessage className="field-error" component="span" name="endTime" />
                                </div>
                                <div className="form-field">
                                    <label>Name</label>
                                    <Field type="text" name="name" />
                                    <ErrorMessage className="field-error" component="span" name="name" />
                                </div>
                                <div className="form-field">
                                    <label>Phone</label>
                                    <Field type="tel" name="phone" />
                                    <ErrorMessage className="field-error" component="span" name="phone" />
                                </div>
                                <div className="form-field">
                                    <label>Persons</label>
                                    <Field type="number" min="1" name="amountOfPersons" />
                                    <ErrorMessage className="field-error" component="span" name="amountOfPersons" />
                                </div>
                                <p className={`availability-message ${availabilityStatus}`} role="status">
                                    {getAvailabilityMessage(availabilityStatus)}
                                </p>
                                <button
                                    className={`reserve-button ${availabilityStatus}`}
                                    type="submit"
                                    disabled={isSubmitting || availabilityStatus !== 'available'}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Reservate'}
                                </button>
                            </form>
                        )}
                    </Formik>
                </section>
            )}
        </main>
    );
}

export default ReservationPage
