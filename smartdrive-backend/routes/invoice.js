const easyinvoice = require('easyinvoice');
const { supabase } = require('../lib/supabaseClient');  

app.post('/generate-receipt', async (req, res) => {
    const { studentId, invoiceDate, products, client } = req.body;

    const invoiceNumber = "INV-" + Date.now();
    const fileName = `${invoiceNumber}.pdf`;
    const folderPath = `receipts/${studentId}/${fileName}`; // Organized per student

    const data = {
        currency: "LKR",
        taxNotation: "gst",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        logo: "",
        sender: {
            company: "SmartDrive",
            address: "Nonya Beez Nest 123",
            zip: "20000",
            city: "Kandy",
            country: "Sri Lanka"
        },
        client,
        invoiceNumber,
        invoiceDate,
        products,
        bottomNotice: "Have a wonderful day!"
    };

    try {
        const result = await easyinvoice.createInvoice(data);
        const pdfBuffer = Buffer.from(result.pdf, 'base64');

        // Upload to Supabase Storage
        const { error, data: storageResult } = await supabase.storage
            .from('receipts') // This is the bucket name
            .upload(folderPath, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) throw error;

        const { data: publicURL } = supabase.storage
            .from('receipts')
            .getPublicUrl(folderPath);

        // You may want to save metadata to your DB here

        res.status(200).json({
            message: 'Receipt generated and uploaded successfully',
            invoiceNumber,
            url: publicURL.publicUrl
        });
    } catch (err) {
        console.error('Error generating or uploading receipt:', err);
        res.status(500).json({ error: 'Failed to generate or upload receipt' });
    }
});
