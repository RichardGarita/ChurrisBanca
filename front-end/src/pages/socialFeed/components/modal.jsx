import {Button} from 'antd';
import {CloseCircleOutlined} from '@ant-design/icons';


export default function Modal({showModal, setShowModal, titulo, content, size}) {

    return (
        <>
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-${size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                {titulo && <h1 className="modal-title fs-5">{titulo}</h1>}
                                <Button icon={<CloseCircleOutlined />} aria-label="Close" onClick={() => setShowModal(false)} className='ms-auto close-modal'/>
                            </div>
                            <div className="modal-body">{content}</div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}
