import React, {useState, useEffect} from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import api from "../../services/api";

import './styles.css';

import LogoImage from '../../assets/logo.svg';

export default function NewBook(){

    const [id, setId] = useState(null);
    const [author, setAuthor] = useState('');
    const [launchDate, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');

    const {bookId} = useParams();
    
    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    async function loadBook(params) {
        try{
            const response = await api.get(`api/v1/book/${bookId}`,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });

            let data = response.data.launchDate.split("T", 10)[0];

            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLaunchDate(data);
        } catch(err){
            alert('Erro ao recuperar o livro! Tente novamente!');
            navigate('/books');
        }
    }

    useEffect(() => {
        if(bookId === '0') return;
        else loadBook();
    }, [bookId]);

    async function saveOrUpdate(e) {
        e.preventDefault();  

        const data = {
            title,
            author,
            launchDate,
            price,
        }

        try{
            if(bookId === '0'){
                await api.post('api/v1/book', data, {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }else{
                data.id = id;
                await api.put('api/v1/book', data, {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
            
            navigate('/books');
        }catch(err){
            alert('Erro ao cadastrar um novo livro');
        }
    }

    return(
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={LogoImage} alt="Logo" />
                    <h1>{bookId === '0' ? 'Adicionar' : 'Atualizar'} Novo Livro</h1>
                    <p>Insira as informações do livro e clique em {bookId === '0' ? "'Adicionar'" : "'Atualizar'"}!</p>
                    <Link className="back-link" to="/books">
                        <FiArrowLeft size={16} color="#251fc5"/>
                        Voltar
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input
                        placeholder="Título"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        placeholder="Autor"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />
                    <input
                        type="date"
                        value={launchDate}
                        onChange={e => setLaunchDate(e.target.value)}
                    />
                    <input
                        placeholder="Preço"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />

                    <button className="button" type="submit">{bookId === '0' ? 'Adicionar' : 'Atualizar'}</button>
                </form>
            </div>
        </div>
    )
}