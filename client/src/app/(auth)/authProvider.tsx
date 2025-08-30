'use client'
import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, Button, Heading, Radio, RadioGroupField, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { usePathname, useRouter } from 'next/navigation';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_CLIENT_ID!,
    },
  },
});

const components = {
  Header: () => (
    <View className='flex justify-between items-center'>
      <Heading level={3} className='text-2xl font-bold'>Welcome to the app</Heading>
    </View>
  ),
  SignIn: {
    Footer: () => {
      const { toSignUp } = useAuthenticator();
      return (
        <View className='flex justify-between items-center'>
          No account? <Button onClick={toSignUp}>Sign up</Button>
        </View>
      )
    },
  },
  SignUp: {
    FormFields(){
      const {validationErrors} = useAuthenticator();
      return (
        <View>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend={"Role"}// labelname
            name={"custom:role"}
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value={"tenant"}>Tenant</Radio>
            <Radio value={"manager"}>Manager</Radio>
          </RadioGroupField>
        </View>
      )
    }
  },
}
const formFields = {
  signIn: {
    email: {  
      label: 'Email Address',
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      isRequired: true,
    }
  },
  signUp: {
    username: {
      order: 1,
      label: 'Choose a username',
      placeholder: 'Enter a username',
      isRequired: true,
    },
    email: {
      order: 2,
      label: 'Email Address',
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      order: 3,
      label: 'Password',
      placeholder: 'Enter your password',
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      isRequired: true,
    }
  }
}
const Auth = ( {children}: {children: React.ReactNode}) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = (/^\/(signin|signup)$/).test(pathname)
  const isDashboardPage = pathname.startsWith('/manager') || pathname.startsWith('/tenants')
  useEffect(() => {
    if (isAuthPage && user) {
      router.push('/');
    }
  }, [isAuthPage, user, router]);


  if (!isDashboardPage && !isAuthPage) {
    return <div>{children}</div>
  }
  return (
    <div className='h-full'>
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        formFields={formFields}
        components={components}
      >
        {() => (
            <>
              {children}
            </>
        )}
      </Authenticator>
    </div>
  );
}
export default Auth;