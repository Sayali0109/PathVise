import { industries } from '@/data/Industries ';
import React from 'react'

const OnBoardingPage = () => {
  //check if user is already onboarded
  return (
    <main>
      <OnboardingForm industries = {industries} />
    </main>
  )
}

export default OnBoardingPage;
