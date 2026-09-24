export type Example = {
  problem: string;
  steps: string[];
};

export type Topic = {
  title: string;
  diagram?: string; // key into components/Diagrams
  body: string;
  formulas?: string[]; // KaTeX
  examples?: Example[];
};

export type Chapter = {
  id: string;
  num: string;
  title: string;
  short: string;
  accent: "cyan" | "magenta" | "green" | "amber";
  topics: Topic[];
};

export const chapters: Chapter[] = [
  {
    id: "foundations",
    num: "01",
    title: "Foundations of Geometry",
    short: "Foundations",
    accent: "cyan",
    topics: [
      {
        title: "Points, Lines, and Planes",
        diagram: "points-lines-planes",
        body: "A point marks a location and has no size. A line is a straight one-dimensional figure extending infinitely in both directions. A plane is a flat two-dimensional surface extending infinitely. Two points determine a line; three non-collinear points determine a plane.",
        formulas: [
          "\\overleftrightarrow{AB} \\text{ denotes the line through } A \\text{ and } B",
          "\\overline{AB} \\text{ denotes the segment from } A \\text{ to } B",
          "\\overrightarrow{AB} \\text{ denotes the ray from } A \\text{ through } B",
        ],
        examples: [
          {
            problem: "Name the plane containing A(1,0,0), B(0,1,0), C(0,0,1).",
            steps: [
              "The three points are non-collinear.",
              "They determine exactly one plane, often written as plane ABC.",
            ],
          },
        ],
      },
      {
        title: "Distance & Midpoint",
        diagram: "distance-midpoint",
        body: "The distance between two points in the plane is found with the Pythagorean-based distance formula. The midpoint is the average of the coordinates.",
        formulas: [
          "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          "M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)",
        ],
        examples: [
          {
            problem: "Distance and midpoint between A(1, 2) and B(7, 10).",
            steps: [
              "d = \\sqrt{(7-1)^2 + (10-2)^2} = \\sqrt{36 + 64} = 10",
              "M = ((1+7)/2, (2+10)/2) = (4, 6)",
            ],
          },
        ],
      },
      {
        title: "Angle Basics",
        diagram: "angle-basics",
        body: "An angle is formed by two rays with a common endpoint (vertex). Angles are classified by measure: acute (<90°), right (=90°), obtuse (90°<θ<180°), straight (=180°). Complementary angles sum to 90°; supplementary angles sum to 180°.",
        formulas: [
          "\\text{Complementary: } \\alpha + \\beta = 90^\\circ",
          "\\text{Supplementary: } \\alpha + \\beta = 180^\\circ",
        ],
        examples: [
          {
            problem: "An angle is 34°. Find its complement and supplement.",
            steps: ["Complement: 90 - 34 = 56°", "Supplement: 180 - 34 = 146°"],
          },
        ],
      },
    ],
  },
  {
    id: "reasoning",
    num: "02",
    title: "Reasoning & Proof",
    short: "Reasoning",
    accent: "magenta",
    topics: [
      {
        title: "Inductive vs. Deductive Reasoning",
        body: "Inductive reasoning uses patterns to form a conjecture. Deductive reasoning uses accepted facts and logic to reach a guaranteed conclusion. A single counterexample disproves a conjecture.",
        examples: [
          {
            problem: "Conjecture: the sum of two odd numbers is odd. True?",
            steps: ["Counterexample: 3 + 5 = 8, which is even.", "The conjecture is false."],
          },
        ],
      },
      {
        title: "Conditional Statements",
        diagram: "conditional",
        body: "A conditional has the form ‘if p, then q’. Its converse swaps p and q. The inverse negates both. The contrapositive negates and swaps. A conditional and its contrapositive are logically equivalent.",
        formulas: [
          "\\text{Conditional: } p \\Rightarrow q",
          "\\text{Converse: } q \\Rightarrow p",
          "\\text{Contrapositive: } \\lnot q \\Rightarrow \\lnot p",
        ],
        examples: [
          {
            problem: "Write the contrapositive of ‘If it rains, the ground is wet.’",
            steps: ["Negate and swap.", "‘If the ground is not wet, then it is not raining.’"],
          },
        ],
      },
      {
        title: "Two-Column Proofs",
        body: "A two-column proof lists statements on the left and reasons on the right. Reasons include given information, definitions, postulates, and previously proven theorems. Common tools: the reflexive, symmetric, and transitive properties of equality.",
        examples: [
          {
            problem: "Given AB = CD and CD = EF, prove AB = EF.",
            steps: [
              "AB = CD (given)",
              "CD = EF (given)",
              "AB = EF (transitive property of equality)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "parallel",
    num: "03",
    title: "Parallel & Perpendicular Lines",
    short: "Parallel Lines",
    accent: "green",
    topics: [
      {
        title: "Angles Formed by a Transversal",
        diagram: "transversal",
        body: "When a transversal cuts two parallel lines, corresponding angles are congruent, alternate interior angles are congruent, alternate exterior angles are congruent, and consecutive (same-side) interior angles are supplementary.",
        formulas: [
          "\\text{Corresponding: } \\angle 1 \\cong \\angle 5",
          "\\text{Alt. interior: } \\angle 3 \\cong \\angle 6",
          "\\text{Co-interior: } m\\angle 3 + m\\angle 5 = 180^\\circ",
        ],
        examples: [
          {
            problem:
              "Lines ℓ ∥ m cut by transversal t. ∠1 = 72°. Find its alternate interior angle.",
            steps: [
              "Alternate interior angles are congruent when lines are parallel.",
              "The alternate interior angle also measures 72°.",
            ],
          },
        ],
      },
      {
        title: "Slopes of Parallel & Perpendicular Lines",
        diagram: "slopes-pp",
        body: "Two non-vertical lines are parallel exactly when their slopes are equal. They are perpendicular exactly when the product of their slopes is −1 (i.e., slopes are negative reciprocals).",
        formulas: ["\\text{Parallel: } m_1 = m_2", "\\text{Perpendicular: } m_1 \\cdot m_2 = -1"],
        examples: [
          {
            problem: "Line through (0, 1) perpendicular to y = 2x + 3.",
            steps: [
              "Slope of given line: 2. Perpendicular slope: -1/2.",
              "y - 1 = -\\tfrac{1}{2}(x - 0) \\Rightarrow y = -\\tfrac{1}{2}x + 1",
            ],
          },
        ],
      },
      {
        title: "Constructing Parallels & Perpendiculars",
        diagram: "constructions",
        body: "Using compass and straightedge, a line parallel to a given line through an external point can be constructed by copying an angle. A perpendicular through a point uses two arcs of equal radius to bisect a segment.",
      },
    ],
  },
  {
    id: "congruence",
    num: "04",
    title: "Triangles & Congruence",
    short: "Congruence",
    accent: "cyan",
    topics: [
      {
        title: "Triangle Angle Sum & Exterior Angle",
        diagram: "triangle-sum",
        body: "The three interior angles of any triangle sum to 180°. An exterior angle equals the sum of its two remote interior angles.",
        formulas: [
          "m\\angle A + m\\angle B + m\\angle C = 180^\\circ",
          "m\\angle \\text{ext} = m\\angle_1 + m\\angle_2",
        ],
        examples: [
          {
            problem: "In △ABC, m∠A = 55°, m∠B = 65°. Find m∠C.",
            steps: ["m∠C = 180 - 55 - 65 = 60°"],
          },
        ],
      },
      {
        title: "Congruence Postulates",
        diagram: "congruence-postulates",
        body: "Two triangles are congruent when a matching set of parts matches: SSS, SAS, ASA, AAS, and HL (right triangles only). SSA is NOT a valid congruence criterion.",
        formulas: ["\\text{SSS, SAS, ASA, AAS, HL}"],
        examples: [
          {
            problem: "△ABC and △DEF: AB = DE, ∠A = ∠D, AC = DF. Which postulate?",
            steps: ["Two sides and the included angle are congruent.", "By SAS, △ABC ≅ △DEF."],
          },
        ],
      },
      {
        title: "CPCTC",
        diagram: "cpctc",
        body: "Once two triangles are proven congruent, ‘Corresponding Parts of Congruent Triangles are Congruent’ can be cited to conclude any pair of corresponding sides or angles are equal.",
        examples: [
          {
            problem: "△ABC ≅ △XYZ. What is m∠B if m∠Y = 47°?",
            steps: ["∠B corresponds to ∠Y.", "By CPCTC, m∠B = 47°."],
          },
        ],
      },
      {
        title: "Isosceles & Equilateral Triangles",
        diagram: "isosceles",
        body: "In an isosceles triangle, the base angles (opposite the congruent sides) are congruent. An equilateral triangle has three 60° angles.",
        formulas: [
          "\\text{Isosceles: } AB = AC \\Rightarrow \\angle B \\cong \\angle C",
          "\\text{Equilateral: each angle} = 60^\\circ",
        ],
      },
    ],
  },
  {
    id: "similarity",
    num: "05",
    title: "Similarity",
    short: "Similarity",
    accent: "magenta",
    topics: [
      {
        title: "Similar Polygons",
        diagram: "similar-polygons",
        body: "Two polygons are similar when corresponding angles are congruent and corresponding sides are proportional. The common ratio is the scale factor k.",
        formulas: ["\\dfrac{AB}{A'B'} = \\dfrac{BC}{B'C'} = \\dfrac{CA}{C'A'} = k"],
      },
      {
        title: "Triangle Similarity: AA, SAS~, SSS~",
        diagram: "similar-triangles",
        body: "Two triangles are similar when: two pairs of angles are congruent (AA); an angle is congruent and its including sides are proportional (SAS~); or all three sides are proportional (SSS~).",
        examples: [
          {
            problem: "△ABC ~ △DEF with AB = 6, DE = 9, BC = 8. Find EF.",
            steps: ["Scale factor from △ABC to △DEF: 9/6 = 3/2.", "EF = 8 · (3/2) = 12"],
          },
        ],
      },
      {
        title: "Side-Splitter & Angle Bisector Theorems",
        diagram: "side-splitter",
        body: "A line parallel to one side of a triangle divides the other two sides proportionally. An angle bisector of a triangle divides the opposite side in the ratio of the adjacent sides.",
        formulas: [
          "\\dfrac{AD}{DB} = \\dfrac{AE}{EC} \\quad (DE \\parallel BC)",
          "\\dfrac{BD}{DC} = \\dfrac{AB}{AC} \\quad (\\text{AD bisects } \\angle A)",
        ],
      },
      {
        title: "Ratios of Perimeters, Areas, Volumes",
        diagram: "scale-ratios",
        body: "If two similar figures have scale factor k, their perimeters are in ratio k, their areas in ratio k², and their volumes in ratio k³.",
        formulas: ["\\text{Perimeters: } k", "\\text{Areas: } k^2", "\\text{Volumes: } k^3"],
      },
    ],
  },
  {
    id: "right-triangles",
    num: "06",
    title: "Right Triangles & Trigonometry",
    short: "Right Triangles",
    accent: "green",
    topics: [
      {
        title: "Pythagorean Theorem & Converse",
        diagram: "pythagorean",
        body: "In any right triangle with legs a, b and hypotenuse c, a² + b² = c². Its converse: if a² + b² = c² for a triangle's sides, then the triangle is right.",
        formulas: ["a^2 + b^2 = c^2"],
        examples: [
          {
            problem: "Find c if a = 5, b = 12.",
            steps: ["c² = 25 + 144 = 169", "c = 13"],
          },
        ],
      },
      {
        title: "Special Right Triangles",
        diagram: "special-right",
        body: "A 45-45-90 triangle has legs equal and hypotenuse leg·√2. A 30-60-90 triangle has sides in the ratio 1 : √3 : 2.",
        formulas: [
          "45\\text{-}45\\text{-}90:\\ 1 : 1 : \\sqrt{2}",
          "30\\text{-}60\\text{-}90:\\ 1 : \\sqrt{3} : 2",
        ],
        examples: [
          {
            problem: "Legs of a 45-45-90 have length 7. Hypotenuse?",
            steps: ["Hypotenuse = 7\\sqrt{2}"],
          },
        ],
      },
      {
        title: "Trigonometric Ratios (SOH-CAH-TOA)",
        diagram: "trig",
        body: "For an acute angle θ in a right triangle: sine is opposite/hypotenuse, cosine is adjacent/hypotenuse, tangent is opposite/adjacent.",
        formulas: [
          "\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}}",
          "\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}}",
          "\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}}",
        ],
        examples: [
          {
            problem: "θ has opp = 3, adj = 4, hyp = 5. Find sin θ, cos θ, tan θ.",
            steps: ["\\sin\\theta = 3/5", "\\cos\\theta = 4/5", "\\tan\\theta = 3/4"],
          },
        ],
      },
      {
        title: "Angles of Elevation & Depression",
        diagram: "elevation",
        body: "An angle of elevation is measured up from the horizontal; an angle of depression, down. In a diagram the two are alternate interior angles and therefore equal.",
        examples: [
          {
            problem: "Sighting the top of a 40 ft flagpole from 30 ft away, angle of elevation?",
            steps: ["\\tan\\theta = 40/30 = 4/3", "\\theta = \\arctan(4/3) \\approx 53.13^\\circ"],
          },
        ],
      },
    ],
  },
  {
    id: "quadrilaterals",
    num: "07",
    title: "Quadrilaterals & Polygons",
    short: "Quadrilaterals",
    accent: "cyan",
    topics: [
      {
        title: "Polygon Angle Sums",
        diagram: "polygon-angles",
        body: "The sum of interior angles of an n-gon is (n − 2)·180°. The sum of exterior angles (one per vertex) is always 360°.",
        formulas: ["S_{\\text{int}} = (n - 2)\\cdot 180^\\circ", "S_{\\text{ext}} = 360^\\circ"],
        examples: [
          {
            problem: "Sum of interior angles of a hexagon.",
            steps: ["(6 - 2) · 180 = 720°"],
          },
        ],
      },
      {
        title: "Parallelograms",
        diagram: "parallelogram",
        body: "In a parallelogram both pairs of opposite sides are parallel and congruent, opposite angles are congruent, consecutive angles are supplementary, and the diagonals bisect each other.",
      },
      {
        title: "Rectangles, Rhombuses, Squares",
        diagram: "special-parallelograms",
        body: "A rectangle is a parallelogram with four right angles (diagonals are congruent). A rhombus is a parallelogram with four congruent sides (diagonals are perpendicular and bisect the vertex angles). A square is both — every property of rectangles and rhombuses holds.",
      },
      {
        title: "Trapezoids & Kites",
        diagram: "trapezoid-kite",
        body: "A trapezoid has exactly one pair of parallel sides (the bases). The midsegment is parallel to the bases and equal to their average. A kite has two pairs of consecutive congruent sides; its diagonals are perpendicular.",
        formulas: ["\\text{Midsegment: } m = \\dfrac{b_1 + b_2}{2}"],
      },
    ],
  },
  {
    id: "circles",
    num: "08",
    title: "Circles",
    short: "Circles",
    accent: "magenta",
    topics: [
      {
        title: "Circumference & Arc Length",
        diagram: "arc-length",
        body: "The circumference of a circle of radius r is 2πr. An arc's length is a fraction of that, proportional to its central angle.",
        formulas: [
          "C = 2\\pi r",
          "\\text{Arc length} = \\dfrac{\\theta}{360^\\circ} \\cdot 2\\pi r",
        ],
        examples: [
          {
            problem: "Arc length for θ = 90° on a circle of radius 6.",
            steps: ["(90/360) · 2π · 6 = (1/4) · 12π = 3π"],
          },
        ],
      },
      {
        title: "Central & Inscribed Angles",
        diagram: "central-inscribed",
        body: "A central angle equals its intercepted arc. An inscribed angle equals half its intercepted arc. Inscribed angles that intercept the same arc are congruent, and an inscribed angle in a semicircle is a right angle.",
        formulas: [
          "\\text{Central: } m\\angle = m\\overset{\\frown}{AB}",
          "\\text{Inscribed: } m\\angle = \\tfrac{1}{2}\\, m\\overset{\\frown}{AB}",
        ],
      },
      {
        title: "Chords, Tangents, and Secants",
        diagram: "chord-tangent-secant",
        body: "A tangent is perpendicular to the radius drawn to the point of tangency. Two tangents from an external point are congruent. Products of chord/secant segments follow the intersecting-chords and secant-tangent power rules.",
        formulas: [
          "\\text{Chords: } AE \\cdot EB = CE \\cdot ED",
          "\\text{Secant-tangent: } t^2 = a(a + b)",
        ],
      },
      {
        title: "Equation of a Circle",
        diagram: "circle-equation",
        body: "A circle with center (h, k) and radius r has the standard equation shown. Complete the square to convert general form to standard form.",
        formulas: ["(x - h)^2 + (y - k)^2 = r^2"],
        examples: [
          {
            problem: "Center and radius of x² + y² − 4x + 6y = 12.",
            steps: [
              "(x-2)^2 - 4 + (y+3)^2 - 9 = 12",
              "(x-2)^2 + (y+3)^2 = 25",
              "Center (2, -3), radius 5",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "area",
    num: "09",
    title: "Area & Perimeter",
    short: "Area",
    accent: "green",
    topics: [
      {
        title: "Triangles & Parallelograms",
        diagram: "parallelogram-area",
        body: "The area of a triangle is one-half base times height. A parallelogram's area is base times height (the perpendicular distance between the parallel sides).",
        formulas: ["A_{\\triangle} = \\tfrac{1}{2}\\,b\\,h", "A_{\\square} = b\\,h"],
        examples: [
          {
            problem: "Triangle with base 10 and height 6.",
            steps: ["A = (1/2)(10)(6) = 30"],
          },
        ],
      },
      {
        title: "Trapezoids & Regular Polygons",
        diagram: "trapezoid-regular",
        body: "A trapezoid's area uses the average of the bases times the height. A regular polygon's area uses one-half its apothem times its perimeter.",
        formulas: [
          "A_{\\text{trap}} = \\tfrac{1}{2}(b_1 + b_2)h",
          "A_{\\text{reg}} = \\tfrac{1}{2}\\,a\\,P",
        ],
      },
      {
        title: "Circles & Sectors",
        diagram: "sector-area",
        body: "A circle of radius r has area πr². A sector is a fraction of that area proportional to its central angle.",
        formulas: [
          "A_{\\circ} = \\pi r^2",
          "A_{\\text{sector}} = \\dfrac{\\theta}{360^\\circ}\\,\\pi r^2",
        ],
        examples: [
          {
            problem: "Sector area for θ = 60°, r = 6.",
            steps: ["(60/360) · π · 36 = 6π"],
          },
        ],
      },
      {
        title: "Composite Figures",
        diagram: "composite",
        body: "For irregular shapes, decompose into familiar pieces (triangles, rectangles, circles), add or subtract areas as needed, and combine.",
      },
    ],
  },
  {
    id: "solids",
    num: "10",
    title: "Surface Area & Volume",
    short: "Solids",
    accent: "cyan",
    topics: [
      {
        title: "Prisms & Cylinders",
        diagram: "prism-cylinder",
        body: "For any right prism or cylinder, the volume is base area times height. The lateral surface area is the perimeter (or circumference) of the base times the height.",
        formulas: [
          "V_{\\text{prism}} = B\\,h",
          "V_{\\text{cyl}} = \\pi r^2 h",
          "SA_{\\text{cyl}} = 2\\pi r^2 + 2\\pi r h",
        ],
        examples: [
          {
            problem: "Volume of a cylinder with r = 3, h = 10.",
            steps: ["V = π(9)(10) = 90π"],
          },
        ],
      },
      {
        title: "Pyramids & Cones",
        diagram: "pyramid-cone",
        body: "A pyramid or cone has one-third the volume of the prism or cylinder with the same base and height. Slant height ℓ is used for lateral surface area of a cone.",
        formulas: [
          "V_{\\text{pyr}} = \\tfrac{1}{3} B h",
          "V_{\\text{cone}} = \\tfrac{1}{3}\\pi r^2 h",
          "SA_{\\text{cone}} = \\pi r^2 + \\pi r \\ell",
        ],
      },
      {
        title: "Spheres",
        diagram: "sphere",
        body: "A sphere of radius r has surface area 4πr² and volume (4/3)πr³.",
        formulas: ["SA_{\\odot} = 4\\pi r^2", "V_{\\odot} = \\tfrac{4}{3}\\pi r^3"],
        examples: [
          {
            problem: "Volume of a sphere with r = 3.",
            steps: ["V = (4/3)π(27) = 36π"],
          },
        ],
      },
      {
        title: "Similar Solids",
        diagram: "similar-solids",
        body: "If two similar solids have linear scale factor k, their surface areas are in ratio k² and their volumes in ratio k³.",
        formulas: ["\\dfrac{SA_1}{SA_2} = k^2", "\\dfrac{V_1}{V_2} = k^3"],
      },
    ],
  },
];
