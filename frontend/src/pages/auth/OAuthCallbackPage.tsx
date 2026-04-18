import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import { Loader2 } from 'lucide-react';
import { useGetMeQuery } from '../../features/auth/authApi';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  useEffect(() => {
    if (accessToken && refreshToken) {
      // First, we set credentials with standard info, leaving user blank temporarily.
      // We'll rely on the protected route or a follow-up query to fetch the user.
      dispatch(setCredentials({ user: null, token: accessToken, refreshToken }));
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [accessToken, refreshToken, dispatch, navigate]);

  // Use the query to fetch user immediately after token is set
  const { data: user, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !accessToken, // Only run once token is found
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials({ user, token: accessToken!, refreshToken: refreshToken! }));
      navigate('/discover');
    } else if (isError) {
      navigate('/login?error=auth_failed');
    }
  }, [isSuccess, isError, user, accessToken, refreshToken, dispatch, navigate]);

  return (
    <AuthLayout title="Authenticating" subtitle="Please wait while we log you in...">
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-gray-600 dark:text-gray-400">Verifying your credentials...</p>
      </div>
    </AuthLayout>
  );
}
