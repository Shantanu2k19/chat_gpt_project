import React from "react"


export default function Login(props) {

    const displayEle = props.isLogin ? "block" : "none";

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        passwordConfirm: "",
        joinedNewsletter: true
    })


    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        // if(formData.password === formData.passwordConfirm) {
        //     console.log("Successfully signed up")
        // } else {
        //     console.log("Passwords do not match")
        //     return
        // }
    }

    return (
        <div className="form-container" style={{ display: displayEle }}>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-top-toggle">
                    <button className="form-switcher-enable">Login</button>
                    <span className="form-switcher-disable" onClick={props.handleClick}>Sign up</span>
                </div>
                <input
                    type="email"
                    placeholder="Email address"
                    className="form--input"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form--input"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <br></br>
                <button className="button-85" role="button">Login</button>
            </form>
        </div>
    )
}