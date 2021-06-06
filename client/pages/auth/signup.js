import { Fragment, useState } from 'react'

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signupHandler = e => {
        e.preventDefault()
        //validate
        //make request
    }

    return <Fragment>
        <form onSubmit={signupHandler}>
            <h1>Signup</h1>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='form-control' value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className='form-group'>
                <label>Password</label>
                <input type='password' className='form-control' value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button className='btn btn-primary'>Signup</button>

        </form>
    </Fragment>
}

export default Signup