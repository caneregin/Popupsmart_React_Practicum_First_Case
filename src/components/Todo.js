import React, { useEffect, useState } from 'react'
import "../App.css"
import "../PopUp.css";

function Todo() {
    // Yeni eklenecek ve güncellenecek input initial value olarak verilir
    const initialValues = { formTodo: "" }
    // initial value state olarak tanımlanır
    const [formValues, setFormValues] = useState(initialValues)
    // input hataları tanımlanır, boş veya 3 karakterden küçük gibi
    const [formErrors, setFormErrors] = useState({})
    // Submit kontrolü
    const [isSubmit, setIsSubmit] = useState(false)
    // input'a değer girildiğinde girilen değer formValues içerisinde
    // formToDo olarak kaydedilir.
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }
    // Submit butonuna basıldığında preventDefault ile sayfa yenilenmesinden kaçınılır
    // Girilen değer geçerliliği kontrol edilir
    const handleSubmit = (e) => {
        e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }
    // Hata yoksa ve submit butonuna tıklandıysa ve
    // eğer açılan pop-up yeni to do eklemeye ait ise postData()
    // değilse updateData() çalışır. SOLID prensipleri açısından
    // kod yenilemesi olmaması için tek bir form ve pop-up yapılmıştır
    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            if (isPost === true) {
                postData()
            } else {
                updateData()
            }
        }
    }, [formErrors])
    // Girilen değerler kontrol edilir. Değer boş veya 3 karakterden
    // az ise hata yazısı belirir.
    const validate = (values) => {
        const errors = {}
        if (!values.formTodo) {
            errors.formTodo = "Lütfen To Do giriniz"
        } else if (values.formTodo.length < 3) {
            errors.formTodo = "To Do en az 3 karakter olabilir"
        }
        return errors
    }
    // Tüm to do verileri için data state tanımlanmıştır
    const [data, setData] = useState([])
    // bazı useEffectleri tetiklemek için counter tanımlanmıştır.
    const [counter, setCounter] = useState(0)
    // tıklanan verinin id için tanımlanmıştır.
    const [updateIdState, setUpdateIdState] = useState("")
    // tıklanan verinin completed olma durumu için tanımlanmıştır.
    const [updateCheckState, setUpdateCheckState] = useState(false)
    // formda girilecek değerlerin post veya update fonksiyonuna gitmesi için tanımlanmıştır.
    const [isPost, setIsPost] = useState(false)
    // post ve update fonksiyonuna gönderilecek veriler burada güncellenir.
    const updateValues = {
        "content": formValues.formTodo,
        "isCompleted": updateCheckState
    }
    // GET ile tüm todo verileri çekilmiştir.
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('https://6320997d9f82827dcf307283.mockapi.io/todos');
            const json = await data.json();
            setData(json);
        }
        fetchData()
            .catch(console.error);;
    }, [counter])
    // POST ile yeni veri eklenmesi
    const postData = async (e) => {
        const data = await fetch('https://6320997d9f82827dcf307283.mockapi.io/todos', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateValues)
        });
        const json = await data.json();
        setCounter(counter + 1)
    }
    // UPDATE ile ilgili id'ye göre veri güncellenmesi
    const updateData = async (e) => {
        const data = await fetch("https://6320997d9f82827dcf307283.mockapi.io/todos/" + updateIdState, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateValues)
        });
        const json = await data.json();
        setCounter(counter + 1)
        toggleModal()
    }
    // DELETE ile ilgili id'ye göre veri silinmesi
    const deleteData = async (e) => {
        const data = await fetch("https://6320997d9f82827dcf307283.mockapi.io/todos/" + e.target.id, {
            method: "DELETE"
        });
        const json = await data.json();
        setCounter(counter + 1)
    }
    // pop-up tanımlaması
    const [modal, setModal] = useState(false);
    // pop-up açık-kapalı olma durumu
    // pop-up içeriğinde gelecek veriler ve post-update pop-up kontrolü
    const toggleModal = (e) => {
        if (e.target.value !== "post") {
            setIsPost(false)
            setUpdateIdState(e.target.id)
            setFormValues({ formTodo: e.target.value })
            setModal(!modal);
        } else {
            setIsPost(true)
            setUpdateIdState(e.target.id)
            setModal(!modal);
        }
    };
    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    return (
        <div>
            <div className='main'>

                <div className='main-layer'>
                    <div><span className='span-todolist'>TO DO LIST</span></div>
                    {/* verilerin map kullanılarak listelenmesi */}
                    {data.map(item => (
                        <>
                            {/* Güncelle butonu */}
                            <div className='data-item1'><button className='button-update' id={item.id} value={item.content} onClick={toggleModal}>Güncelle</button></div>
                            {/* completed durumuna göre content üzeri çizilir */}
                            {item.isCompleted === false ? <div className='data-item2'>{item.content}</div> : <div className='data-item-completed'>{item.content}</div>}
                            {/* sil butonu */}
                            <div className='data-item3'><button className='button-delete' id={item.id} onClick={deleteData}>Sil</button></div>
                            {/* css float left düzenlemesi için clear left */}
                            <div className='data-item-clear'></div>
                        </>
                    ))}
                    {/* pop-up  */}
                    {modal && (
                        <div className="modal">
                            <div onClick={toggleModal} className="overlay"></div>
                            <div className="modal-content">
                                <h2>To Do List</h2>
                                {/* form input radio butonlar ve post-update durumuna göre submit butonu */}
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="formTodo" value={formValues.formTodo} onChange={handleChange} /><br />
                                    <p>{formErrors.formTodo}</p>
                                    <input type="radio" onClick={() => setUpdateCheckState(true)} /> Completed
                                    <input type="radio" onClick={() => setUpdateCheckState(false)} /> Not Complete &nbsp; <br />
                                    {isPost === true ? <button type="submit" className='button-post forMargin'>Ekle</button> : <button type="submit" className='button-update forMargin'>Güncelle</button>}
                                </form>
                                <button className="close-modal button-delete" onClick={toggleModal}>Kapat</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='post-button'>
                <button className='button-post' value="post" onClick={toggleModal}>Yeni To Do Ekle</button>
            </div>
        </div>
    )
}

export default Todo