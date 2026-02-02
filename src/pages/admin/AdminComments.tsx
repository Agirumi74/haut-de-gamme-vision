import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Check, X, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  post_id: string;
  user_id: string;
  blog_posts?: {
    title: string;
    slug: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AdminComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    setIsLoading(true);
    let query = supabase
      .from("blog_comments")
      .select(`
        *,
        blog_posts:post_id (title, slug),
        profiles:user_id (first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("is_approved", false);
    } else if (filter === "approved") {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erreur lors du chargement des commentaires");
    } else {
      setComments(data as any || []);
    }
    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de l'approbation");
    } else {
      toast.success("Commentaire approuvé");
      fetchComments();
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    const { error } = await supabase.from("blog_comments").delete().eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Commentaire supprimé");
      fetchComments();
    }
  };

  return (
    <AdminLayout title="Commentaires" description="Modérez les commentaires du blog">
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "bg-gradient-luxury text-primary-foreground" : ""}
        >
          En attente
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
          className={filter === "approved" ? "bg-gradient-luxury text-primary-foreground" : ""}
        >
          Approuvés
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-gradient-luxury text-primary-foreground" : ""}
        >
          Tous
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auteur</TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Aucun commentaire
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {(comment as any).profiles?.first_name} {(comment as any).profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(comment as any).profiles?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="truncate max-w-[150px]">
                      {(comment as any).blog_posts?.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="truncate max-w-[250px]">{comment.content}</p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {comment.is_approved ? (
                      <Badge className="bg-success text-success-foreground">Approuvé</Badge>
                    ) : (
                      <Badge variant="secondary">En attente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!comment.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(comment.id)}
                          className="text-success"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReject(comment.id)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
