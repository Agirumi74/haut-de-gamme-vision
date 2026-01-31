import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Wait a bit for roles to load
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Retour au site</span>
        </Link>

        <Card className="card-shadow">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-elegant font-bold text-2xl">A</span>
            </div>
            <CardTitle className="text-2xl font-elegant">Administration</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder au panneau d'administration
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  aria-describedby={error ? "error-message" : undefined}
                  className="focus-visible:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="pr-10 focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>Vous n'avez pas de compte ?</p>
            <Link 
              to="/admin/register" 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            >
              Créer un compte administrateur
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
