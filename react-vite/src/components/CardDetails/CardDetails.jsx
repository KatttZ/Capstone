import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import OpenModalButton from "../OpenModalButton";
import EditCardModal from "../EditCardModal";
import ConfirmDeletionModal from "../ConfirmDeletionModal";

import './CardDetails.css';

export default function CardDetails({ card, listId }) {


    return (
        <div className="card">
            <div>{card.title }</div>
            <div className="card-action">
            <OpenModalButton
                modalComponent={
                    <EditCardModal/>
                }
                buttonText={<MdOutlineEdit/>}
            />
            <OpenModalButton
                modalComponent={
                    <ConfirmDeletionModal
                        itemId={card.id}
                        itemType="card"
                        listId={listId}
                    />
                }
                buttonText={<FaTrashCan/>}
            />
            </div>
        </div>
    );
}