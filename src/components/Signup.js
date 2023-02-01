import React from "react"


export default function Signup(props) {

    const displayEle = props.isLogin ? "none" : "block";

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
        passwordconfirm: ""
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
        if (formData.password === formData.passwordConfirm) {
            console.log("Successfully signed up")
        } else {
            console.log("Passwords do not match")
            return
        }
    }


    return (
        <div className="form-container" style={{ display: displayEle }}>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-top-toggle">
                    <span className="form-switcher-disable" onClick={props.handleClick} >Login</span>
                    <span className="form-switcher-enable">Sign up</span>
                </div>
                <input
                    type="name"
                    placeholder="Name"
                    className="form--input"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                />
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
                <input
                    type="password"
                    placeholder="Re-enter Password"
                    className="form--input"
                    name="passwordconfirm"
                    onChange={handleChange}
                    value={formData.passwordconfirm}
                />
                <br></br>
                <button className="button-85">Sign Up</button>
            </form>

        </div>
    )
}