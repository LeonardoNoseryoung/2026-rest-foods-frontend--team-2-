import { useState, useEffect } from 'react'
import { Formik, Field, ErrorMessage } from 'formik';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, options);

    if (!response.ok) {
        throw new Error(`${path} failed with ${response.status} ${response.statusText}`);
    }

    return response.json();
}

interface ReservationFormValues {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    phone: string;
}

interface RestaurantTable {
    TableId: string;
    Chairs: number;
}

interface Reservation {
    ReservationId: string;
    StartingTime: string;
    EndingTime: string;
    AmountOfPersons: number;
    PhoneNumber: string;
    NameofPerson: string;
    restaurantTable: RestaurantTable;
}

function ReservationPage() {
    const initialValues: ReservationFormValues = {
    id: 0,
    name: "",
    startTime: '',
    endTime: '',
    phone: '',
  };

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  
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


    const handleSubmit = async (values: ReservationValues) => {
        const response = await fetch("http://localhost:8080/reservations/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ ...values, id: selectedTable }),
        });
        if (response.ok) {
            setSelectedTable(null);
        } catch (error) {
            console.error("Reservation fehlgeschlagen:", error);
        }
    };

    return (
        <div>
            {selectedTable === null ? (
                <div>
                  <h1>Reservations</h1>
                    {tables.length === 0 ? (
                        <p>No tables available</p>
                    ) : (
                        tables.map((table) => (
                            <div key={table.TableId}>
                                <p>Table {table.TableId} ({table.Chairs} chairs)</p>
                                <button onClick={() => setSelectedTable(table)}>
                                    Make Reservation
                                </button>
                            </div>
                        ))
                    )}

                    <h2>Already booked:</h2>
                    {reservations.map((res) => (
                        <div key={res.ReservationId}>
                            Table {res.restaurantTable.TableId} — {res.StartingTime} bis {res.EndingTime}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedTable(null)}>Back</button>
                    <h1>Reserve Table {selectedTable.TableId}</h1>

                    <Formik
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors: Partial<ReservationFormValues> = {};
                            if (!values.startTime) errors.startTime = 'Required';
                            if (!values.endTime)   errors.endTime   = 'Required';
                            if (!values.name)      errors.name      = 'Required';
                            if (!values.phone)     errors.phone     = 'Required';
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
