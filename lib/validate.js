export default function Validate(values){
    const errors = {}

    if(!values.email){
        errors.email = 'Email field is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
     errors.email = 'Invalid email address';
    }

    if(!values.password){
        errors.password = 'Password field is required';
    }
    else if(values.password.includes(' ')){
        errors.password = 'Password cannot contain spaces';
    }

    return errors
}