import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLoginWithGoogle } from "../services/hooks";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginFunction() {
    const navigate = useNavigate();
    const { mutateAsync: userLogin } = useLoginWithGoogle();

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_ENV_GOOGLE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    userLogin({ idToken: credentialResponse.credential })
                        .then(data => {
                            if (data && data?.success) {
                                navigate('/')
                            }
                        });
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
        </GoogleOAuthProvider>
    )
}