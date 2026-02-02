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
import { Plus, Edit, Trash2, Eye, FileText, Download, Search, Euro } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  paid_at: string | null;
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

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Form state
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(20);
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, [statusFilter, searchQuery]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    let query = supabase
      .from("invoices")
      .select(`
        *,
        clients:client_id (first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (searchQuery) {
      query = query.ilike("invoice_number", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erreur lors du chargement des factures");
    } else {
      setInvoices(data as any || []);
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

  const updateItemTotal = (index: number, field: keyof InvoiceItem, value: any) => {
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
    setEditingInvoice(null);
    setClientId("");
    setIssueDate(format(new Date(), "yyyy-MM-dd"));
    setDueDate(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
    setStatus("draft");
    setNotes("");
    setTaxRate(20);
    setItems([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!clientId || items.some(i => !i.description)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSaving(true);
    const { subtotal, taxAmount, total } = calculateTotals();

    // Generate invoice number
    const { data: numberData } = await supabase.rpc("generate_invoice_number");
    const invoiceNumber = numberData || `${format(new Date(), "yyyy")}-00001`;

    const invoiceData = {
      invoice_number: editingInvoice?.invoice_number || invoiceNumber,
      client_id: clientId,
      status,
      issue_date: issueDate,
      due_date: dueDate,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: notes || null,
      paid_at: status === "paid" ? new Date().toISOString() : null
    };

    let invoiceId: string;
    let error;

    if (editingInvoice) {
      const { error: updateError } = await supabase
        .from("invoices")
        .update(invoiceData)
        .eq("id", editingInvoice.id);
      error = updateError;
      invoiceId = editingInvoice.id;
    } else {
      const { data, error: insertError } = await supabase
        .from("invoices")
        .insert(invoiceData)
        .select()
        .single();
      error = insertError;
      invoiceId = data?.id;
    }

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      // Save invoice items
      if (editingInvoice) {
        await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      }

      const itemsData = items.map(item => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }));

      await supabase.from("invoice_items").insert(itemsData);

      toast.success(editingInvoice ? "Facture modifiée !" : "Facture créée !");
      setIsDialogOpen(false);
      fetchInvoices();
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette facture ?")) return;

    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Facture supprimée");
      fetchInvoices();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-info text-info-foreground",
      paid: "bg-success text-success-foreground",
      overdue: "bg-destructive text-destructive-foreground",
      cancelled: "bg-muted text-muted-foreground"
    };
    const labels: Record<string, string> = {
      draft: "Brouillon",
      sent: "Envoyée",
      paid: "Payée",
      overdue: "En retard",
      cancelled: "Annulée"
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  // Stats
  const stats = {
    total: invoices.reduce((sum, inv) => sum + Number(inv.total), 0),
    paid: invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + Number(inv.total), 0),
    pending: invoices.filter(i => ["draft", "sent"].includes(i.status)).reduce((sum, inv) => sum + Number(inv.total), 0)
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <AdminLayout title="Factures" description="Gérez la facturation clients">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total facturé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.total.toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Encaissé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{stats.paid.toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{stats.pending.toFixed(2)} €</p>
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
            <SelectItem value="sent">Envoyées</SelectItem>
            <SelectItem value="paid">Payées</SelectItem>
            <SelectItem value="overdue">En retard</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-luxury text-primary-foreground" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-elegant text-xl">
                {editingInvoice ? "Modifier la facture" : "Nouvelle facture"}
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
                  <Label>Date d'échéance</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <Label>Lignes de facture</Label>
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
                      <SelectItem value="sent">Envoyée</SelectItem>
                      <SelectItem value="paid">Payée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
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
              <TableHead>N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Aucune facture
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>
                    {(invoice as any).clients
                      ? `${(invoice as any).clients.first_name} ${(invoice as any).clients.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.issue_date), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.due_date), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {Number(invoice.total).toFixed(2)} €
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(invoice.id)}
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

export default AdminInvoices;
