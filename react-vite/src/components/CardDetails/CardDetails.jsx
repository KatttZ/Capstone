import { FaTrashCan } from "react-icons/fa6";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";

import './CardDetails.css';

export default function CardDetails({ card, listId }) {


    return (
        <div className="card">
            <div>{card.title }</div>
            <OpenModalButton
                modalComponent={
                    <ConfirmDeletionModal
                        itemId={card.id}
                        itemType="card"
                        listId={listId}
                    />
                }
                onButtonClick={(e) => e.stopPropagation()}
                buttonText={<FaTrashCan/>}
            />
        </div>
    );
}