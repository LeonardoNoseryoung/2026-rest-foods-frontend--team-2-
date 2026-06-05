import React, {useState, useEffect} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface ReservationValues {
    id: number;
    guests: number;
    startTime: string;
    endTime: string;
    phone: string;
}

function ReservationPage() {
    const initialValues: ReservationValues = {
    id: 0,
    guests: 0,
    startTime: '',
    endTime: '',
    phone: '',
  };
  
  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("https://dein-backend.com/reservations");
        const data = await response.json();
        setReservations(data);

    };
    fetchData();
  }, []);

  

  const [reservations, setReservations] = useState([]);


  return (
    <div>ReservationPage

        Already booked:
        [array of reservations]
    </div>
  )
}

export default ReservationPage