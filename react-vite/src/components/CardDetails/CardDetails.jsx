import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { thunkGetCardComments } from "../../redux/comment";
import OpenModalButton from "../OpenModalButton";
import EditCardModal from "../EditCardModal";
import ConfirmDeletionModal from "../ConfirmDeletionModal";

import './CardDetails.css';

export default function CardDetails({ card, listId }) {
    const dispatch = useDispatch();

    return (
        <div className="card">
            <div>{card.title }</div>
            <div className="card-action">
            <OpenModalButton
                modalComponent={
                    <EditCardModal card={card}/>
                }
                buttonText={<MdOutlineEdit/>}
                onButtonClick={() => {dispatch(thunkGetCardComments(card.id));}}
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