import React, { useState, useEffect} from "react";
import { useNavigate, Link } from 'react-router-dom';
import { FiPower, FiEdit, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";

import './styles.css';
import logoImage from '../../assets/logo.svg';

export default function Books(){

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);

    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    async function logout() {
        localStorage.clear();
        navigate('/');
    }

    async function editBook(id) {
        try{
            navigate(`/book/new/${id}`);
        }catch(err){
            alert('Erro ao editar um Livro! Tente novamente!');
        }
    }

    async function deleteBook(id) {
        try{
            await api.delete(`api/v1/book/${id}`, {
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setBooks(books.filter(book => book.id !== id)); /*Apos remover do banco de dados, essa linha remove o livro deletado da tela*/
        }catch(err){
            alert('Erro ao deletar um Livro! Tente novamente!');
        }
    }

    async function fetchMoreBooks() {
        const response = await api.get('api/v1/book', {
            headers:{
                Authorization: `Bearer ${accessToken}`
            },
            params:{
                page: page,
                size: 4,
                direction: 'asc'
            }
        });

        setBooks([ ...books, ...response.data._embedded.books]);
        setPage(page+1);
    }

    useEffect(() => {
        fetchMoreBooks();
    }, []);

    return (
        <div className="book-container">
            <header>
                <img src={logoImage} alt="Logo"/>
                <span>Bem Vindo, <strong>{username.toUpperCase()}</strong>!</span>
                <Link className="button" to="/book/new/0">Adicionar novo Livro</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color="#251FC5"/>
                </button>
            </header>
            <h1>Livros Registrados</h1>
            <ul>
               {books.map(book => (
                 <li key={book.id}>
                    <strong>Título:</strong>
                    <p>{book.title}</p>
                    <strong>Autor:</strong>
                    <p>{book.author}</p>
                    <strong>Preço:</strong>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                    <strong>Data de Lançamento:</strong>
                    <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>

                    <button onClick={() => editBook(book.id)} type="button">
                        <FiEdit size={20} color="#251FC5"/>
                    </button>

                    <button onClick={() => deleteBook(book.id)} type="button">
                        <FiTrash2 size={20} color="#251FC5"/>
                    </button>
                </li>
               ))}
            </ul>

            <button className="button" onClick={fetchMoreBooks} type="button">Carregar mais</button>
        </div>
    )
}