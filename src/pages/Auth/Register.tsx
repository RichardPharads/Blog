import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

 
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    
    });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      console.log("User:", data.user);
      console.log("Session:", data.session);
      navigate("/blog");
    }
  };

  return (
    <>
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
    

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Register;
