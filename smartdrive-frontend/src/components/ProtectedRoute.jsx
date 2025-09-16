const ProtectedRoute = ({ allowedRoles, children }) => {
    const { session } = useAuth();
    const [role, setRole] = useState(null);
  
    useEffect(() => {
      const fetchRole = async () => {
        const { data } = await axios.get('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        setRole(data.role);
      };
  
      if (session) fetchRole();
    }, [session]);
  
    if (!role) return <div>Loading...</div>;
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
  
    return children;
  };
  
export default ProtectedRoute;
  