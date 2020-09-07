import React, { Children } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import 'babel-polyfill';




import LoginForm from '../../src/components/loginForm'

jest.mock('axios')



describe('loginForm', () => {

    it('should render three elements', () => {
        render(<LoginForm />)
        expect(screen.getAllByPlaceholderText('Password').length).toBe(1);  
        expect(screen.getAllByPlaceholderText('Username').length).toBe(1);   
        expect(screen.getAllByText('Login').length).toBe(1);
    })

    it('Change display value when user input', () => {
        render(<LoginForm />)
        const username = 'me';
        const password = 'please';
        expect(screen.getByPlaceholderText('Username').value).toBe('')
        expect(screen.getByPlaceholderText('Password').value).toBe('')
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: username } })
        expect(screen.getByPlaceholderText('Username').value).toBe(username)
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } })
        expect(screen.getByPlaceholderText('Password').value).toBe(password)
        screen.getByPlaceholderText('Password')
    })

    it('should handle submit by sending axios request', async () => {
        render(<LoginForm />)
        
        const username = 'me';
        const password = 'please';
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: username } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } })


        await fireEvent.click(screen.getByText('Login'))

        expect(mockAxios).toHaveBeenCalledTimes(1)
        expect(mockAxios).toHaveBeenCalledWith({
                method: 'post',           
                url: 'api/login',
                headers: {'Content-Type': 'application/JSON; charset=UTF-8'},
                data:{
                    "username": username,
                    "password": password,
                }
                    
                })
    })

    

});