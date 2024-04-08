export function useValidation() {
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase()) ? '' : 'A valid email is required.';
    };

    const validateField = (value, field, limit) => {
        if (!value) return `${field} is required.`;
        if (limit && value.length < limit) return `${field} must be at least ${limit} characters.`;
        return '';
    };

    const validatePasswordComplexity = (password) => {
        let errorMessage = validateField(password, "Password", 8); 
        if (!errorMessage) { 
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                errorMessage += 'Password must contain at least one special character. ';
            }
            if ((password.match(/[a-zA-Z]/g) || []).length < 3) {
                errorMessage += 'Password must contain at least three letters. ';
            }
            if (!/[A-Z]/.test(password)) {
                errorMessage += 'Password must contain at least one uppercase character. ';
            }
        }
        return errorMessage;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword ? '' : 'Passwords must match.';
    };

    const validateForm = (form, errors, isLogin = false) => {
        let isValid = true;
        Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));
        errors.value.email = validateEmail(form.value?.email);
        errors.value.password = isLogin ? validateField(form.value?.password, "Password") : validatePasswordComplexity(form.value.password);
        if (!isLogin) {
            errors.value.firstName = validateField(form.value?.firstName, "First Name", 3);
            errors.value.lastName = validateField(form.value?.lastName, "Last Name", 3);
            errors.value.confirmPassword = validateConfirmPassword(form.value?.password, form.value?.confirmPassword);
            errors.value.roleId = validateField(form.value?.roleId, "Role");
        }
        isValid = !Object.values(errors.value).some(error => error !== '');
        return isValid;
    };
    return {
        validateForm,
        validateEmail,
    };
}
