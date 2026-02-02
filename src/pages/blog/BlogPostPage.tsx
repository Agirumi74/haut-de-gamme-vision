import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Eye, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  published_at: string | null;
  views_count: number;
  author_id: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchComments();
    }
  }, [slug]);

  const fetchPost = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("Error fetching post:", error);
      navigate("/blog");
    } else if (data) {
      setPost(data);
      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ views_count: data.views_count + 1 })
        .eq("id", data.id);
    } else {
      navigate("/blog");
    }
    setIsLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("blog_comments")
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("post_id", post?.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments(data as any);
    }
  };

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("blog_comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment.trim()
    });

    if (error) {
      toast.error("Erreur lors de l'envoi du commentaire");
    } else {
      toast.success("Commentaire envoyé !", {
        description: "Il sera visible après validation."
      });
      setNewComment("");
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>

          {/* Article Header */}
          <article>
            {post.cover_image_url && (
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <header className="mb-8">
              {post.category && (
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  {post.category}
                </Badge>
              )}
              
              <h1 className="font-elegant text-3xl md:text-4xl font-bold text-foreground mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.published_at), "d MMMM yyyy", { locale: fr })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views_count} vues
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {comments.length} commentaires
                </span>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>

          <Separator className="my-12" />

          {/* Comments Section */}
          <section>
            <h2 className="font-elegant text-2xl font-bold text-foreground mb-6">
              Commentaires ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <Card className="mb-8 border-border">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-luxury text-primary-foreground">
                          {profile?.first_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Écrivez votre commentaire..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-gradient-luxury text-primary-foreground"
                        disabled={isSubmitting || !newComment.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Envoi..." : "Publier"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 border-border">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Connectez-vous pour laisser un commentaire
                  </p>
                  <Button asChild>
                    <Link to="/connexion">Se connecter</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun commentaire pour l'instant. Soyez le premier !
                </p>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={(comment as any).profiles?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(comment as any).profiles?.first_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-foreground">
                              {(comment as any).profiles?.first_name} {(comment as any).profiles?.last_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(comment.created_at), "d MMM yyyy", { locale: fr })}
                            </span>
                          </div>
                          <p className="text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
