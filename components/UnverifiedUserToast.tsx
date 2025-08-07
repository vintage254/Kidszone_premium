"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const UnverifiedUserToast = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('unverified') === 'true') {
      toast({
        title: 'Account Verification Required',
        description: 'You need to complete Step 1 and Step 2 to get access to tutoring jobs and be able to bid on them.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  return null;
};

export default UnverifiedUserToast;
