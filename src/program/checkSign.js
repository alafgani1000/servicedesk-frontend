import axios from 'axios'
import { useEffect, useState } from 'react'

const CheckSign = (props) => {
    if(props.isLogin === '401'){
        return true;
    }else{
        return false;
    }
}

export default CheckSign