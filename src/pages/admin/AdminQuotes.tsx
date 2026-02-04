import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, FileText, Search, ArrowRight, Receipt } from "lucide-react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Quote {
  id: string;
  quote_number: string;
  client_id: string | null;
  status: string;
  issue_date: string;
  valid_until: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  converted_to_invoice_id: string | null;
  clients?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  // Form state
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [validUntil, setValidUntil] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));
  const [status, setStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(20);
  const [items, setItems] = useState<QuoteItem[]>([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuotes();
    fetchClients();
  }, [statusFilter, searchQuery]);

  const fetchQuotes = async () => {
    setIsLoading(true);
    let query = supabase
      .from("quotes")
      .select(`
        *,
        clients:client_id (first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (searchQuery) {
      query = query.ilike("quote_number", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erreur lors du chargement des devis");
    } else {
      setQuotes(data as any || []);
    }
    setIsLoading(false);
  };

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("last_name");
    if (data) setClients(data);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const updateItemTotal = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const openCreateDialog = () => {
    setEditingQuote(null);
    setClientId("");
    setIssueDate(format(new Date(), "yyyy-MM-dd"));
    setValidUntil(format(addDays(new Date(), 30), "yyyy-MM-dd"));
    setStatus("draft");
    setNotes("");
    setTaxRate(20);
    setItems([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
    setIsDialogOpen(true);
  };

  const openEditDialog = async (quote: Quote) => {
    setEditingQuote(quote);
    setClientId(quote.client_id || "");
    setIssueDate(quote.issue_date);
    setValidUntil(quote.valid_until);
    setStatus(quote.status);
    setNotes(quote.notes || "");
    setTaxRate(quote.tax_rate);

    // Fetch quote items
    const { data: itemsData } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quote.id);

    if (itemsData && itemsData.length > 0) {
      setItems(itemsData.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      })));
    } else {
      setItems([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
    }

    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!clientId || items.some(i => !i.description)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSaving(true);
    const { subtotal, taxAmount, total } = calculateTotals();

    // Generate quote number
    const { data: numberData } = await supabase.rpc("generate_quote_number");
    const quoteNumber = numberData || `DEV-${format(new Date(), "yyyy")}-00001`;

    const quoteData = {
      quote_number: editingQuote?.quote_number || quoteNumber,
      client_id: clientId,
      status,
      issue_date: issueDate,
      valid_until: validUntil,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: notes || null
    };

    let quoteId: string;
    let error;

    if (editingQuote) {
      const { error: updateError } = await supabase
        .from("quotes")
        .update(quoteData)
        .eq("id", editingQuote.id);
      error = updateError;
      quoteId = editingQuote.id;
    } else {
      const { data, error: insertError } = await supabase
        .from("quotes")
        .insert(quoteData)
        .select()
        .single();
      error = insertError;
      quoteId = data?.id;
    }

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      // Save quote items
      if (editingQuote) {
        await supabase.from("quote_items").delete().eq("quote_id", quoteId);
      }

      const itemsData = items.map(item => ({
        quote_id: quoteId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }));

      await supabase.from("quote_items").insert(itemsData);

      toast.success(editingQuote ? "Devis modifié !" : "Devis créé !");
      setIsDialogOpen(false);
      fetchQuotes();
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce devis ?")) return;

    const { error } = await supabase.from("quotes").delete().eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Devis supprimé");
      fetchQuotes();
    }
  };

  const handleConvertToInvoice = async (quote: Quote) => {
    if (!confirm("Convertir ce devis en facture ?")) return;

    // Generate invoice number
    const { data: numberData } = await supabase.rpc("generate_invoice_number");
    const invoiceNumber = numberData || `FAC-${format(new Date(), "yyyy")}-00001`;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        client_id: quote.client_id,
        status: "draft",
        issue_date: format(new Date(), "yyyy-MM-dd"),
        due_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        subtotal: quote.subtotal,
        tax_rate: quote.tax_rate,
        tax_amount: quote.tax_amount,
        total: quote.total,
        notes: quote.notes
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      toast.error("Erreur lors de la création de la facture");
      return;
    }

    // Copy quote items to invoice items
    const { data: quoteItems } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quote.id);

    if (quoteItems && quoteItems.length > 0) {
      await supabase.from("invoice_items").insert(
        quoteItems.map(item => ({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        }))
      );
    }

    // Update quote with reference to invoice
    await supabase
      .from("quotes")
      .update({ 
        status: "accepted", 
        converted_to_invoice_id: invoice.id 
      })
      .eq("id", quote.id);

    toast.success("Devis converti en facture !");
    fetchQuotes();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-info text-info-foreground",
      accepted: "bg-success text-success-foreground",
      rejected: "bg-destructive text-destructive-foreground",
      expired: "bg-warning text-warning-foreground"
    };
    const labels: Record<string, string> = {
      draft: "Brouillon",
      sent: "Envoyé",
      accepted: "Accepté",
      rejected: "Refusé",
      expired: "Expiré"
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  // Stats
  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === "draft").length,
    sent: quotes.filter(q => q.status === "sent").length,
    accepted: quotes.filter(q => q.status === "accepted").length
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <AdminLayout title="Devis" description="Gérez les devis clients">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total devis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-info">{stats.sent}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{stats.accepted}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="sent">Envoyés</SelectItem>
            <SelectItem value="accepted">Acceptés</SelectItem>
            <SelectItem value="rejected">Refusés</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-luxury text-primary-foreground" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau devis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-elegant text-xl">
                {editingQuote ? "Modifier le devis" : "Nouveau devis"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Client & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.first_name} {client.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date d'émission</Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valide jusqu'au</Label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <Label>Lignes du devis</Label>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description *"
                        value={item.description}
                        onChange={(e) => updateItemTotal(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) => updateItemTotal(index, "quantity", parseInt(e.target.value) || 1)}
                        min={1}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Prix"
                        value={item.unit_price}
                        onChange={(e) => updateItemTotal(index, "unit_price", parseFloat(e.target.value) || 0)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={`${item.total.toFixed(2)} €`}
                        disabled
                        className="text-right"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une ligne
                </Button>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm items-center gap-4">
                  <span className="text-muted-foreground">TVA</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right"
                    />
                    <span>%</span>
                    <span className="w-24 text-right">{taxAmount.toFixed(2)} €</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total TTC</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Status & Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="sent">Envoyé</SelectItem>
                      <SelectItem value="accepted">Accepté</SelectItem>
                      <SelectItem value="rejected">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes internes..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  className="bg-gradient-luxury text-primary-foreground"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Devis</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead>Valide jusqu'au</TableHead>
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
            ) : quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun devis trouvé
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.quote_number}</TableCell>
                  <TableCell>
                    {quote.clients
                      ? `${quote.clients.first_name} ${quote.clients.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(quote.total).toFixed(2)} €
                  </TableCell>
                  <TableCell>
                    {format(new Date(quote.valid_until), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {quote.status !== "accepted" && !quote.converted_to_invoice_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleConvertToInvoice(quote)}
                          title="Convertir en facture"
                        >
                          <Receipt className="h-4 w-4 text-success" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(quote)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(quote.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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

export default AdminQuotes;
