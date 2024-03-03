import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import logoURL from '../assets/icon.png'
import { useState } from 'react';

export default function LoginView() {
    const [text, onChangeText] = useState('Useless Text');
    const login = (e) => {
        // e.preventDefault()
        // console.log(e)
        // console.log(e.nativeEvent)
        // e.preventDefault();
        // const data = new FormData(e.target);
        // console.log([...data.entries()]);
        localStorage.setItem("loggedIn", "true")
        // localStorage.setItem("type", text.strip().toLowerCase() === "felix" ? "Admin" : "User")
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">

            <form className="flex w-96 flex-col gap-4" onSubmit={login}>
                <div className="mb-20 flex flex-row items-center justify-center">
                    <img src={logoURL} className="mr-5 h-6 sm:h-9 rounded-lg" alt="ING Logo" />
                    <h1 className="text-5xl font-bold">Login</h1>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your Username" />
                    </div>
                    <TextInput id="email1" type="username" placeholder="" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your Password" />
                    </div>
                    <TextInput id="password1" type="password" required />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
