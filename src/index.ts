import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

//METODO PARA PEGAR TODOS OS EVENTOS
app.get("/eventos", async (req, res) => {
  const eventos = await prisma.evento.findMany({
    orderBy: { nome: "desc" },
  });

  res.json(eventos);
});


//METODO PARA CRIAÇÃO DE EVENTO
app.post("/eventos", async (req, res) => {
  const evento = await prisma.evento.create({
    data: {
      nome: req.body.nome ?? "Evento",
      imgURL: req.body.imgurl ?? "https://github.com/daviaragaoyt.png",
      descricao: req.body.descricao ?? "Descrição vazia",
      local: req.body.local ?? "Local vazio",
      palestrante: req.body.palestrante ?? "Sem palestrante"
    },
  });

  return res.json(evento);
});

//METODO PRA BUSCAR EVENTO PELO ID
app.get("/eventos/:id", async (req, res) => {
  const id = req.params.id
  const evento = await prisma.evento.findUnique({
    where: { id },
  });

  return res.json(evento);
});

//METODO PRA ATUALIZAR UM EVENTO PELO ID
app.put("/eventos/:id", async (req, res) => {
  const id = req.params.id
  const evento = await prisma.evento.update({
    where: { id },
    data: req.body,
  });

  return res.json(evento);
});


//METODO PRA DELTAR EVENTO
app.delete("/eventos/:id", async (req, res) => {
  const id = req.params.id
  await prisma.evento.delete({
    where: { id },
  });

  return res.send({ status: "ok" });
});

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>EVENTO API</h1>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
