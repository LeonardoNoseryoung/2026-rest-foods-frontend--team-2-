import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";


export default function TableDetailPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <Button onClick={() => navigate(-1)}>Back</Button>
            <h1>Table {tableId}</h1>
            {/* hier dein Detail-Inhalt */}
        </div>
    );
}