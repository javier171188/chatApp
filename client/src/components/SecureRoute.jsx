import { Redirect, Route } from "react-router-dom";

function SecureRoute({ component: Component, isAuth, ...props }) {
    let path = props.path;
    return (
        <Route
            {...props}
            render={() => {
                if (isAuth && (path === '/chat/register' || path === '/chat/login')) {
                    return <Redirect to="/chat/" />
                } else if (isAuth) {
                    return <Component />
                } else if (!isAuth && (path === '/chat/register' || path === '/chat/login')) {
                    return <Component />
                } else {
                    return <Redirect to="/chat/login" />
                }
            }
            }
        />
    );
}

export default SecureRoute;