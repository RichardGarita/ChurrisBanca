import { useState } from "react";
import SearchFriend from "./searchFriend";
import Follow from "./follow";
import Unfollow from "./unfollow";
import Modal from './modal';

export default function Friends () {
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    return <>
        <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            content={<SearchFriend/>}
            titulo={"Buscar amigo"}
        />
        <Modal
            showModal={showModal2}
            setShowModal={setShowModal2}
            content={<Follow/>}
            titulo={"Seguir a alguien"}
        />

        <Modal
            showModal={showModal3}
            setShowModal={setShowModal3}
            content={<Unfollow/>}
            titulo={"Dejar de seguir a alguien"}
        />

        <div className="mx-auto text-center d-flex flex-column">
            <button type="button" className="btn btn-primary d-block mb-2" onClick={() => setShowModal(!showModal)}>Buscar amigo</button>
            <button type="button" className="btn btn-primary d-block mb-2" onClick={() => setShowModal2(!showModal2)}>Seguir a alguien</button>
            <button type="button" className="btn btn-danger d-block" onClick={() => setShowModal3(!showModal3)}> Dejar de seguir a alguien</button>
        </div>
    </>
}