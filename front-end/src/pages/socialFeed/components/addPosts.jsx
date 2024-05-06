export default function AddPost({userId}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const contentValue = event.target.content.value;
        const imageFile = event.target.image.files[0];

        console.log("Contenido:", contentValue);
        console.log("Imagen:", imageFile);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group text-start col-11 mx-auto">
                    <label htmlFor="content">Contenido</label>
                    <textarea id="content" name="content" className='form-control' type="text"></textarea>
                </div>

                <div className="form-group text-start col-11 mx-auto">
                    <label htmlFor="image">Imagen</label>
                    <input id="image" name="image" className='form-control' type="file"></input>
                </div>

                <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
        </>
    )
}