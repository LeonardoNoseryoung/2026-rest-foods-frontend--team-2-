import React, {useState, useEffect} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface ReservationValues {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    phone: string;
}

function ReservationPage() {
    const initialValues: ReservationValues = {
    id: 0,
    name: "",
    startTime: '',
    endTime: '',
    phone: '',
  };

  const [tables, setTables] = useState<number[]>([]);
  const [reservations, setReservations] = useState<ReservationValues[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  
useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("// Da chumt Backend URL");
        const data = await response.json();
        setReservations(data);

        
        const tablesResponse = await fetch("// Da chumt Backend URL");
        const tablesData = await tablesResponse.json();
        setTables(tablesData);
    };
    fetchData();
}, []);


    const handleSubmit = async (values: ReservationValues) => {
        const response = await fetch("// Da chumt Backend URL", {
            method: "POST",
            headers: {"Content-Type": "application/json"}, // sagt: ws ich dir schicke ist JSOn
            body: JSON.stringify({ ...values, id: selectedTable }), //Reservations Datn werden ans Backend geschickt
        });
        if (response.ok) {
            setSelectedTable(null);
        }
    };

    return (
        <div>
            {selectedTable === null ? (
                <div>
                  <h1>Reservations</h1>
                    {tables.map((table) => (
                        <div key={table}>
                            <p>Table {table}</p>
                            <button onClick={() => setSelectedTable(table)}>
                                Make Reservation
                            </button>
                        </div>
                    ))}

                    <h2>Already booked:</h2>
                    {reservations.map((res) => (
                        <div key={res.id}>
                            Table {res.id} — {res.startTime} bis {res.endTime}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedTable(null)}>Back</button>
                    <h1>Reserve Table {selectedTable}</h1>

                    <Formik
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors: Partial<ReservationValues> = {};
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