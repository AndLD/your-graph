import { useState } from 'react'
import '../styles/AuthPage.scss'
import SignupForm from '../components/Auth/SignupForm'
import SigninForm from '../components/Auth/SigninForm'

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
                {isSignUp ? <SignupForm /> : <SigninForm />}
                <p
                    style={{ marginTop: '15px', cursor: 'pointer', color: '#1677ff', textAlign: 'right' }}
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </p>
            </div>
        </div>
    )
}
