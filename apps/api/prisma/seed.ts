import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Set de café Bruma",
    description: "Cafetera de filtro, jarra de vidrio y soporte de acero para preparar café lento con una extracción limpia y estable.",
    price: 89.9,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Bolso tote de lona Norte",
    description: "Bolso resistente de lona encerada con asas reforzadas, bolsillo interior y tamaño perfecto para trabajo o escapadas.",
    price: 124.0,
    stock: 7,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Altavoz cerámico Aura",
    description: "Altavoz inalámbrico con carcasa cerámica mate, sonido cálido y autonomía para acompañar cualquier habitación.",
    price: 219.5,
    stock: 4,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Lámpara de mesa Sombra",
    description: "Lámpara compacta con pantalla textil, base mineral y luz regulable para escritorios, mesillas o rincones de lectura.",
    price: 149.0,
    stock: 9,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Manta de algodón Duna",
    description: "Manta suave de algodón peinado con textura ligera, ideal para sofá, cama o tardes frescas en terraza.",
    price: 68.5,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Servicio de mesa Caliza",
    description: "Set de cuatro platos de gres esmaltado con acabado irregular, apto para lavavajillas y uso diario.",
    price: 96.0,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop"
  }
];

const main = async () => {
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "admin123", 12);

  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@solenne.local" },
    update: {},
    create: {
      name: "Solenne Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@solenne.local",
      passwordHash,
      role: "admin"
    }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: product,
      create: product
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded. Admin: admin@solenne.local, password: admin123");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
