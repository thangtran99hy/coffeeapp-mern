import React,{lazy} from 'react';
import * as links from "../constants/links";
import Home from "../components/Home/Home";

const arrayRoutesPrivate = [
    {
        path: links.HOME,
        component: () => <Home />,
        exact: true,
        permission: []
    },
];


export default arrayRoutesPrivate;
