import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (options: PositionOptions = { enableHighAccuracy: true }) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  const [permission, setPermission] = useState<PermissionState | null>(null);

  useEffect(() => {
    let mounted = true;
    let watchId: number;

    const onSuccess = (position: GeolocationPosition) => {
      if (mounted) {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      }
    };

    const onError = (error: GeolocationPositionError) => {
      if (mounted) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    };

    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
      if (mounted) {
        setPermission(result.state);
        result.onchange = () => {
          if (mounted) setPermission(result.state);
        };
      }
    });

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => {
      mounted = false;
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [options.enableHighAccuracy, options.maximumAge, options.timeout]);

  const requestLocation = () => {
    setState((prev) => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState((prev) => ({ ...prev, error: err.message, loading: false }));
      },
      options
    );
  };

  return { ...state, permission, requestLocation };
};
