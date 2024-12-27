import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //--------- User Table ---------//
  await prisma.user.createMany({
    data: [
      {
        id: "1",
        firstName: "User1",
        lastName: "User1",
        email: "user1@test.com",
        password: "user1",
      },
      {
        id: "2",
        firstName: "User2",
        lastName: "User2",
        email: "user2@test.com",
        password: "user2",
      },
    ],
  });

  //--------- Event Table ---------//
  await prisma.event.createMany({
    data: [
      {
        id: "event101",
        title: "Event 1",
        description: "Event 1 description",
        category: "WEDDING",
        date: new Date("2024-10-31"),
        startTime: new Date("2024-10-31T09:00:00Z"),
        endTime: new Date("2024-10-31T17:00:00Z"),
        status: "APPROVED",
        additionalNotes: "Additional notes for event 1",
        hasCleaningFee: true,
        additionalHours: 2,
        venue: "Venue 1",
        userId: "1",
      },
      {
        id: "event202",
        title: "Event 2",
        description: "Event 2 description",
        category: "BIRTHDAY",
        date: new Date("2024-11-10"),
        startTime: new Date("2024-11-10T14:00:00Z"),
        endTime: new Date("2024-11-10T22:00:00Z"),
        additionalNotes: "Additional notes for event 2",
        hasCleaningFee: false,
        additionalHours: 1,
        venue: "Venue 2",
        userId: "1",
      },
    ],
  });

  //--------- PackageDetails Table ---------//
  await prisma.packagesDetails.createMany({
    data: [
      {
        title: "Picka Pick-A-Snack Corner:",
        description: "Sandwich, Fruits, Salad & Drinks",
      },
      {
        title: "Buffet",
        description:
          "Main dishes (Beef, Pork, Chicken, or Fish) with Dessert, Pasta, and unlimited Rice, Iced Tea, and Water.",
      },
    ],
  });

  //--------- InclusionDetails Table ---------//
  await prisma.inclusionsDetails.createMany({
    data: [
      { name: "Trained & Uniformed Servers" },
      { name: "Basic Backdrop Design" },
      { name: "Souvenir & Gift Table" },
      { name: "Cake Table" },
      { name: "Motif & Theme-Based Venue Styling" },
      { name: "Chairs & Round Table w/ Table No." },
      { name: "Basic Entrance Arc" },
    ],
  });

  //--------- MainDishPackage Table ---------//
  const mainDishPackage = await prisma.mainDishPackage.create({
    data: {
      id: "2_package1",
      name: "Package 1",
      numOfDishesCategory: 2,
      price: 720,
      minPax: 1,
      maxPax: 69,
    },
  });

  await prisma.mainDishPackage.createMany({
    data: [
      {
        id: "2_package2",
        name: "Package 2",
        numOfDishesCategory: 2,
        price: 560,
        minPax: 70,
        maxPax: 99,
      },
      {
        id: "2_package3",
        name: "Package 3",
        numOfDishesCategory: 2,
        price: 470,
        minPax: 100,
        maxPax: 149,
      },
      {
        id: "2_package4",
        name: "Package 4",
        numOfDishesCategory: 2,
        price: 375,
        minPax: 150,
        maxPax: 200,
      },
      {
        id: "3_package1",
        name: "Package 1",
        numOfDishesCategory: 3,
        price: 850,
        minPax: 1,
        maxPax: 69,
      },
      {
        id: "3_package2",
        name: "Package 2",
        numOfDishesCategory: 3,
        price: 650,
        minPax: 70,
        maxPax: 99,
      },
      {
        id: "3_package3",
        name: "Package 3",
        numOfDishesCategory: 3,
        price: 520,
        minPax: 100,
        maxPax: 149,
      },
      {
        id: "3_package4",
        name: "Package 4",
        numOfDishesCategory: 3,
        price: 450,
        minPax: 150,
        maxPax: 200,
      },
    ],
  });

  //--------- MainDishDetails Table ---------//
  const mainDish1 = await prisma.mainDishDetails.create({
    data: {
      id: "beef_broccoli",
      name: "Beef broccoli",
      category: "Beef",
      description: "",
    },
  });

  const mainDish2 = await prisma.mainDishDetails.create({
    data: {
      id: "pork_hamonado",
      name: "Pork hamonado",
      category: "Pork",
      description: "",
    },
  });

  await prisma.mainDishDetails.createMany({
    data: [
      //------- Beef Category -------//
      {
        id: "beef_stroganoff",
        name: "Beef stroganoff",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_with_mushroom",
        name: "Beef with mushroom",
        category: "Beef",
        description: "",
      },
      {
        id: "sliced_roast_beef_mushroom_sauce",
        name: "Sliced roast beef with mushroom sauce",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_mechado",
        name: "Beef mechado",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_caldereta",
        name: "Beef caldereta",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_karekare",
        name: "Beef karekare",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_teriyaki",
        name: "Beef teriyaki",
        category: "Beef",
        description: "",
      },
      {
        id: "beef_lengua",
        name: "Beef lengua",
        category: "Beef",
        description: "",
      },

      //------- Pork Category -------//
      {
        id: "pork_caldereta",
        name: "Pork caldereta",
        category: "Pork",
        description: "",
      },
      {
        id: "sweet_and_sour_pork",
        name: "Sweet and sour pork",
        category: "Pork",
        description: "",
      },
      {
        id: "sliced_roast_pork_mushroom_sauce",
        name: "Sliced roast pork with mushroom sauce",
        category: "Pork",
        description: "",
      },
      {
        id: "pork_mechado",
        name: "Pork mechado",
        category: "Pork",
        description: "",
      },
      {
        id: "pork_menudo",
        name: "Pork menudo",
        category: "Pork",
        description: "",
      },
      {
        id: "pork_loin_gravy_sauce",
        name: "Pork loin with gravy sauce",
        category: "Pork",
        description: "",
      },
      {
        id: "pork_broccoli",
        name: "Pork broccoli",
        category: "Pork",
        description: "",
      },

      //------- Chicken Category -------//
      {
        id: "chicken_honey",
        name: "Chicken honey",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_cordon_bleu",
        name: "Chicken cordon bleu",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_teriyaki",
        name: "Chicken teriyaki",
        category: "Chicken",
        description: "",
      },
      {
        id: "orange_chicken",
        name: "Orange chicken",
        category: "Chicken",
        description: "",
      },
      {
        id: "breaded_baked_chicken",
        name: "Breaded baked chicken",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_fillet_gravy_sauce",
        name: "Chicken fillet with gravy sauce",
        category: "Chicken",
        description: "",
      },
      {
        id: "fried_chicken",
        name: "Fried chicken",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_pastel",
        name: "Chicken pastel",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_afritada",
        name: "Chicken afritada",
        category: "Chicken",
        description: "",
      },
      {
        id: "chicken_fillet_ala_king",
        name: "Chicken fillet ala-king",
        category: "Chicken",
        description: "",
      },

      //------- Fish Category -------//
      {
        id: "sweet_and_sour_fish",
        name: "Sweet and sour fish",
        category: "Fish",
        description: "",
      },
      {
        id: "fish_fillet_tartar_sauce",
        name: "Fish fillet with tartar sauce",
        category: "Fish",
        description: "",
      },

      //------- Veggies Category -------//
      {
        id: "chopsuey",
        name: "Chopsuey",
        category: "Veggies",
        description: "",
      },
      {
        id: "sipo_egg",
        name: "Sipo egg",
        category: "Veggies",
        description: "",
      },
      {
        id: "seven_kinds",
        name: "7 kinds",
        category: "Veggies",
        description: "",
      },
      {
        id: "mix_veggies",
        name: "Mix veggies",
        category: "Veggies",
        description: "",
      },

      //------- Drinks Category -------//
      {
        id: "blue_lemonade",
        name: "Blue lemonade",
        dishType: "OTHERS",
        category: "Drink",
        description: "",
      },
      {
        id: "pineapple_juice",
        name: "Pineapple juice",
        dishType: "OTHERS",
        category: "Drink",
        description: "",
      },
      {
        id: "orange_juice",
        name: "Orange juice",
        dishType: "OTHERS",
        category: "Drink",
        description: "",
      },
      {
        id: "red_tea_iced_tea",
        name: "Red tea or Iced tea",
        dishType: "OTHERS",
        category: "Drink",
        description: "",
      },

      //------- Desserts Category -------//
      {
        id: "buko_salad",
        name: "Buko salad",
        dishType: "OTHERS",
        category: "Dessert",
        description: "",
      },
      {
        id: "fruit_salad",
        name: "Fruit salad",
        dishType: "OTHERS",
        category: "Dessert",
        description: "",
      },
      {
        id: "buko_pandan",
        name: "Buko pandan",
        dishType: "OTHERS",
        category: "Dessert",
        description: "",
      },
      {
        id: "coffee_jelly",
        name: "Coffee jelly",
        dishType: "OTHERS",
        category: "Dessert",
        description: "",
      },

      //------- Pastas Category -------//
      {
        id: "baked_macaroni",
        name: "Baked Macaroni",
        dishType: "OTHERS",
        category: "Pasta",
        description: "",
      },
      {
        id: "spaghetti",
        name: "Spaghetti",
        dishType: "OTHERS",
        category: "Pasta",
        description: "",
      },
      {
        id: "creamy_carbonara",
        name: "Creamy Carbonara",
        dishType: "OTHERS",
        category: "Pasta",
        description: "",
      },
      {
        id: "pasta_alfredo",
        name: "Pasta Alfredo",
        dishType: "OTHERS",
        category: "Pasta",
        description: "",
      },
    ],
  });

  //------- PickASnackCornerDetails Table  -------//
  const snack1 = await prisma.pickASnackCornerDetails.create({
    data: {
      id: "sandwich_ham",
      name: "Ham",
      category: "Sandwich",
      description: "",
    },
  });

  await prisma.pickASnackCornerDetails.createMany({
    data: [
      {
        id: "sandwich_tuna",
        name: "Tuna",
        category: "Sandwich",
        description: "",
      },
      {
        id: "sandwich_chicken",
        name: "Chicken",
        category: "Sandwich",
        description: "",
      },
      {
        id: "sandwich_clubhouse",
        name: "Clubhouse",
        category: "Sandwich",
        description: "",
      },
      {
        id: "fruit_papaya",
        name: "Papaya",
        category: "Fruit",
        description: "",
      },
      {
        id: "fruit_watermelon",
        name: "Watermelon",
        category: "Fruit",
        description: "",
      },
      {
        id: "fruit_apple",
        name: "Apple",
        category: "Fruit",
        description: "",
      },
      {
        id: "fruit_orange",
        name: "Orange",
        category: "Fruit",
        description: "",
      },
      {
        id: "fruit_pineapple",
        name: "Pineapple",
        category: "Fruit",
        description: "",
      },
      {
        id: "salad_caesar",
        name: "Caesar Salad",
        category: "Salad Dressing",
        description: "",
      },
      {
        id: "salad_honey",
        name: "Honey",
        category: "Salad Dressing",
        description: "",
      },
    ],
  });

  //------- CateringAddOns Table  -------//
  const addOn1 = await prisma.cateringAddOnsDetails.create({
    data: {
      id: "street_food_cart",
      name: "Street Food Cart",
      category: "Food Cart",
      description: "3 hrs service",
      price: 4000,
      paxCapacity: 50,
      serviceHours: 3,
    },
  });

  await prisma.cateringAddOnsDetails.createMany({
    data: [
      //------- Food Cart Category ------//
      {
        id: "pop_corn_cart",
        name: "Pop Corn Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4000,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "juice_cart",
        name: "Juice Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4000,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "hotdog_cart",
        name: "Hotdog Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4000,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "cotton_candy_cart",
        name: "Cotton Candy Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "ice_scramble_cart",
        name: "Ice Scramble Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "candy_cart",
        name: "Candy Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "donut_cart",
        name: "Donut Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "nachos_cart",
        name: "Nachos Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "siomai_cart",
        name: "Siomai Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4500,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "kakanin_cart",
        name: "Kakanin Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4800,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "ice_cream_cart",
        name: "Ice Cream Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4800,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "taho_cart",
        name: "Taho Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4800,
        paxCapacity: 50,
        serviceHours: 3,
      },
      {
        id: "fruit_cart",
        name: "Fruit Cart",
        category: "Food Cart",
        description: "3 hrs service",
        price: 4800,
        paxCapacity: 50,
        serviceHours: 3,
      },

      //------- Technicals Category ------//
      {
        id: "photographer",
        name: "Photographer",
        category: "Technicals",
        description: "Basic Videos & Photos",
        price: 3500,
        paxCapacity: 1,
        serviceHours: 4,
      },
      {
        id: "photo_booth",
        name: "Photo Booth",
        category: "Technicals",
        description: "",
        price: 4500,
        paxCapacity: 1,
        serviceHours: 2,
      },
      {
        id: "lights_sound_dj",
        name: "Lights, Sound, & DJ",
        category: "Technicals",
        description: "Free for 150 pax",
        price: 5000,
        paxCapacity: 150,
        serviceHours: 4,
      },
      {
        id: "emcee",
        name: "Emcee",
        category: "Technicals",
        description: "Professional emcee for the event",
        price: 5500,
        paxCapacity: 1,
        serviceHours: 4,
      },
      {
        id: "hair_make_up",
        name: "Hair & Make Up",
        category: "Technicals",
        description: "Traditional Make-up for 1 person",
        price: 4500,
        paxCapacity: 1,
        serviceHours: 4,
      },
      {
        id: "live_singer",
        name: "Live Singer",
        category: "Technicals",
        description: "",
        price: 4000,
        paxCapacity: 1,
        serviceHours: 4,
      },
      {
        id: "led_backdrop",
        name: "LED Backdrop",
        category: "Technicals",
        description: "Height: 9 Feet x Width: 12 Feet",
        price: 20000,
        paxCapacity: 1,
        serviceHours: 4,
      },
    ],
  });

  //------- CateringSelection Table ------//
  await prisma.cateringSelection.create({
    data: {
      id: "catering1",
      expectedPax: 100,
      totalAmount: 700,
      numberOfMainDishes: 2,
      packageId: mainDishPackage.id,
      eventId: "event101",
      mainDishes: {
        create: [
          { mainDishDetailId: mainDish1.id },
          { mainDishDetailId: mainDish2.id },
        ],
      },
      pickASnackCorner: {
        create: [{ pickASnackCornerId: snack1.id }],
      },
      addOns: {
        create: [{ addOnDetailId: addOn1.id }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
