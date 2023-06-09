import React,{lazy} from 'react';
import * as links from "../constants/links";
import HomePage from "../components/HomePage";
import Login from "../components/auth/ClientLogin";
import ForgotPassword from "../components/auth/MailSentNotice";
import Registration from "../components/auth/Registration";
import UserProfilePage from "../components/parent/userProfile/UserProfilePage";
import StudentNewApplication from "../components/parent/application/ParentApplicationPage.js"
import NewApplicationPage from "../components/student/application/NewApplicationPage";

const Page403 = lazy(() => import("../theme/PageError/Page403"));
const Page404 = lazy(() => import("../theme/PageError/Page404"));
const Page400 = lazy(() => import("../theme/PageError/Page400"));
const Page500 = lazy(() => import("../theme/PageError/Page500"));
const DashBoard = lazy(() => import("../components/DashBoard"));


const arrayRoutes = [
    /* Page 403 */
    {
        path: links.PAGE403,
        component: () => <Page403 />,
        exact: false,
    },
    // {
    //     path: links.PAGE404,
    //     component: () => <Page404 />,
    //     exact: false,
    // },
    {
        path: links.PAGE400,
        component: () => <Page400 />,
        exact: false,
    },
    {
        path: links.PAGE500,
        component: ({match})=> <Page500 match={match} />,
        exact: false,
    },
    // {
    //     path: links.STUDENT_LOGIN,
    //     component: () => <Login />,
    //     exact: true,
    // },
    // {
    //     path: links.FORGOT_PASSWORD,
    //     component: () => <ForgotPassword />,
    //     exact: true,
    // },
    // {
    //     path: links.STUDENT_REGISTRATION,
    //     component: () => <Registration />,
    //     exact: false,
    // },
    {
        path: links.DASHBOARD,
        component: () => <DashBoard />,
        exact: true
    },
    // {
    //     path: '*',
    //     component: () => <Page404 />,
    //     exact: false,
    // },
];


export default arrayRoutes;
