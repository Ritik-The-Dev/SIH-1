import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLoginWithGoogle } from "../services/hooks";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";

export default function GoogleLoginFunction() {
    const darkMode = useRecoilValue(themeState);
    const { mutateAsync: userLogin } = useLoginWithGoogle();

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_ENV_GOOGLE_CLIENT_ID}>
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        userLogin({ idToken: credentialResponse.credential })
                            .then(data => {
                                if (data && data?.success) {
                                    window.location.href = "/"
                                }
                            });
                    }}
                    onError={() => {
                        console.log("Login Failed");
                    }}
                    theme={darkMode ? "filled_black" : "outline"} 
                    size="large"
                    width="100%"   
                    shape="rectangular"
                    text="continue_with"
                />
            </div>
        </GoogleOAuthProvider>
    );
}
