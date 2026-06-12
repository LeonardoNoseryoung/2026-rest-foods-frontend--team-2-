import { useState, useEffect } from 'react'
import { Formik, Field, ErrorMessage } from 'formik';

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

function getTableId(table: RestaurantTable): string {
    return table.tableId ?? table.TableId ?? '';
}

function getChairs(table: RestaurantTable): number | undefined {
    return table.chairs ?? table.Chairs;
}

function toBackendDateTime(value: string): string {
    return value.length === 16 ? `${value}:00` : value;
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


    const handleSubmit = async (values: ReservationFormValues) => {
        if (!selectedTable) return;
        setReservationFeedback('Submitting reservation...');

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
        const response = await fetch("http://localhost:8080/reservations", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reservation),
        });
        if (response.ok){
            setReservationFeedback('Reservation submitted successfully.');
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
        }
    };

    return (
        <div>
            {selectedTable === null ? (
                <div>
                  <h1>Reservations</h1>
                    {reservationFeedback && (
                        <p role="status">{reservationFeedback}</p>
                    )}
                    {tables.length === 0 ? (
                        <p>No tables available</p>
                    ) : (
                        tables.map((table) => (
                            <div key={getTableId(table)}>
                                <p>Table {getTableId(table)} ({getChairs(table)} chairs)</p>
                                <button onClick={() => {
                                    setReservationFeedback('');
                                    setSelectedTable(table);
                                }}>
                                    Make Reservation
                                </button>
                            </div>
                        ))
                    )}

                    <h2>Already booked:</h2>
                    {reservations.map((res) => (
                        <div key={res.reservationId ?? res.ReservationId}>
                            Table {getTableId(res.restaurantTable)} — {res.startingTime ?? res.StartingTime} bis {res.endingTime ?? res.EndingTime}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedTable(null)}>Back</button>
                    <h1>Reserve Table {getTableId(selectedTable)}</h1>
                    {reservationFeedback && (
                        <p role="status">{reservationFeedback}</p>
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
                            return errors;
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>From</label>
                                    <Field type="datetime-local" name="startTime" />
                                    <ErrorMessage name="startTime" />
                                </div>
                                <div>
                                    <label>To</label>
                                    <Field type="datetime-local" name="endTime" />
                                    <ErrorMessage name="endTime" />
                                </div>
                                <div>
                                    <label>Name</label>
                                    <Field type="text" name="name" />
                                    <ErrorMessage name="name" />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <Field type="tel" name="phone" />
                                    <ErrorMessage name="phone" />
                                </div>
                                <div>
                                    <label>Persons</label>
                                    <Field type="number" min="1" name="amountOfPersons" />
                                    <ErrorMessage name="amountOfPersons" />
                                </div>
                                <button type="submit">Reserve</button>
                            </form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
}

export default ReservationPage
