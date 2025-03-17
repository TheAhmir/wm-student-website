import React, {useState, useEffect} from 'react'
import { IoMdClose } from "react-icons/io";
import './AddComment.scss'

const AddComment = ({close, this_user, course}) => {
    const [user, setUser] = useState(null)
    const [difficulty, setDifficulty] = useState(null);
    const [workLoad, setWorkLoad] = useState(null);
    const [professor, setProfessor] = useState('');
    const [review, setReview] = useState('');

    const createReview = (e) => {
        e.preventDefault();
        if (user) {
        fetch(`${process.env.REACT_APP_API_URL}/reviews/create_review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // ADD SECRET KEY
                //'Authorization': token
            },
            body: JSON.stringify({
                courseid: course.id,
                userid: user.uid,
                difficulty: difficulty,
                workload: workLoad,
                professor: professor === '' ? null : professor,
                body: review
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)

            alert("You're review has been recorded!")
            window.location.reload()
    })
        .catch(error => alert('Error', error))
        } else {
            alert("Must be signed in to post a comment.")
        }


    }

    const correctRating = (rating) => {
        if (rating > 5 ) {
            return 5
        }
        if (rating < 0) {
            return 0
        }
        return rating
    }

    useEffect(() => {
        setUser(this_user)
    }, [this_user])

    return (
        <div className='comment-page'>
            <div className='background'>
                <form className='content' onSubmit={createReview}>
                    <div className='header'>
                        <h1>Leave a review!</h1>
                        <IoMdClose className='icon' onClick={close}/>
                    </div>
                    <div className='rating'>
                        <div className="input-group">
                            <label className="">Difficulty: <span className='required'>*</span></label>
                            <input className={`${difficulty < 2.5 ? 'low-text' : difficulty < 4 ? 'med-text' : 'high-text'}`} type='number' placeholder='2.5' max='5' min='0' step='0.1' value={difficulty} onChange={(e) => setDifficulty(correctRating(parseFloat(e.target.value)))} required></input>
                        </div>
                        <div className="input-group">
                            <label className="">Work Load: <span className='required'>*</span></label>
                            <input className={`${workLoad < 2.5 ? 'low-text' : workLoad < 4 ? 'med-text' : 'high-text'}`} type='number' placeholder='2.5' max='5' min='0' step='0.1' value={workLoad} onChange={(e) => setWorkLoad(correctRating(parseFloat(e.target.value)))} required></input>
                        </div>
                    </div>
                    <div className='input-group'>
                        <label className="">Professor:</label>
                        <input placeholder='professor'value={professor} onChange={(e) => setProfessor(e.target.value)}></input>
                    </div>
                    <div className='review-container input-group'>
                        <label className=''>Review <span className='required'>*</span></label>
                        <textarea className='review' value={review} onChange={(e) => setReview(e.target.value)} required></textarea>
                    </div>
                    <div>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddComment;
