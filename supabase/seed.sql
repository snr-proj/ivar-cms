-- ============================================================================
-- Seed data
--
-- Run this AFTER schema.sql and storage.sql.
--
-- Everything here comes directly from what you told me — no invented
-- clients, awards, dates, or credits. Fields left NULL (e.g. social links,
-- Digital OOH client projects, cover images for Kolin/EVA Air/HEYS) are
-- intentionally empty placeholders for you to fill in from the admin
-- dashboard once you have the real assets/links.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- site_settings (single row)
-- ----------------------------------------------------------------------------
insert into public.site_settings (
  name, professional_title, location, email, phone, bio,
  linkedin_url, instagram_url, vimeo_url, showreel_url, education
) values (
  'Ivar Delos Santos',
  'Media Production Artist / Production Specialist',
  'Malolos, Bulacan, Philippines',
  'ivardelsan@gmail.com',
  '+63 977 031 7864',
  'I''m Ivar Delos Santos, a Media Production Artist with professional experience in commercial productions, on-set operations, digital content adaptation, and creative production. At Onionbulb Productions, I work closely with production and creative teams throughout different stages of a project—from pre-production requirements and logistics to set preparation and on-set execution. I also handle client-provided materials, editing and reformatting visual assets to meet the specifications of LED billboards, gantries, and 3D digital displays, including executions around BGC. With a background in Communication Arts, photography, and cinematography, I continue to develop my creative thinking and production skills across both physical production and digital advertising.',
  null, -- linkedin_url — add from admin, do not invent
  null, -- instagram_url — add from admin, do not invent
  null, -- vimeo_url — add from admin, do not invent
  null, -- showreel_url — add from admin, do not invent
  '[
    {
      "degree": "Bachelor of Arts in Communication",
      "school": "STI College Malolos",
      "location": "City of Malolos, Bulacan",
      "years": "S.Y. 2021–2025",
      "recognitions": [
        "Sine Bulacan XI — \"Dito\" — Finalist",
        "Sine Bulacan X — \"Buboy\" — Finalist",
        "STI Media Week Photography Contest — Champion"
      ]
    }
  ]'::jsonb
);

-- ----------------------------------------------------------------------------
-- experience
-- ----------------------------------------------------------------------------
insert into public.experience
  (company, organization, position, start_date, end_date, current, description, responsibilities, sort_order)
values
  (
    'Onionbulb Productions',
    'United Neon Media Group',
    'Media Production Artist / Production Specialist',
    '2025-01-01',
    null,
    true,
    null,
    array[
      'Commercial Production',
      'Set Preparation',
      'Production Logistics',
      'Props',
      'Talent Requirements',
      'Location Requirements',
      'On-Set Execution',
      'Creative Collaboration',
      'Client Material Adaptation',
      'Layout & Reformatting',
      'LED Material Fitting',
      'Gantry LED Content',
      '3D Billboard Materials',
      'DOOH Content Preparation'
    ],
    10
  ),
  (
    'When in Rizal',
    null,
    'Production Assistant Intern',
    null,
    null,
    false,
    'Gained hands-on experience across production, content creation, and event coverage. Responsibilities included shoot preparation, equipment handling, shot-list development, production assistance, hosting, and client-facing work. The experience strengthened my communication, adaptability, critical thinking, and ability to work collaboratively in fast-moving production environments.',
    null,
    20
  ),
  (
    'IKONEK Multimedia Organization',
    null,
    'Department Head — Photography & Documentation',
    '2022-01-01',
    '2023-12-31',
    false,
    null,
    null,
    30
  );

-- ----------------------------------------------------------------------------
-- skills
-- ----------------------------------------------------------------------------
insert into public.skills (category, name, sort_order) values
  ('Production', 'Production Assistance', 10),
  ('Production', 'Set Preparation', 20),
  ('Production', 'Production Logistics', 30),
  ('Production', 'Prop Coordination', 40),
  ('Production', 'Talent / Location Requirements', 50),
  ('Production', 'Shot Listing', 60),
  ('Production', 'On-Set Support', 70),
  ('Production', 'Creative Development', 80),

  ('Digital & LED', 'LED Material Fitting', 10),
  ('Digital & LED', 'Client Material Adaptation', 20),
  ('Digital & LED', 'Layout & Reformatting', 30),
  ('Digital & LED', 'Digital Billboard Content', 40),
  ('Digital & LED', 'Gantry LED Materials', 50),
  ('Digital & LED', '3D Billboard Materials', 60),
  ('Digital & LED', 'DOOH Content Preparation', 70),

  ('Camera & Visual', 'Photography', 10),
  ('Camera & Visual', 'Cinematography', 20),
  ('Camera & Visual', 'Camera Operation', 30),
  ('Camera & Visual', 'Composition', 40),
  ('Camera & Visual', 'Visual Storytelling', 50),

  ('Software', 'Adobe Premiere Pro', 10),
  ('Software', 'Adobe Photoshop', 20),
  ('Software', 'Adobe Lightroom', 30),
  ('Software', 'Adobe Illustrator', 40),
  ('Software', 'CapCut', 50),
  ('Software', 'Canva', 60),
  ('Software', 'Microsoft Office', 70);

-- ----------------------------------------------------------------------------
-- projects — Selected Commercial Work (featured, shown first)
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title, client, category, project_type, production_company, role, year,
   description, contributions, featured, sort_order, cover_image, published)
values
  (
    'kolin',
    'Kolin',
    'KOLIN',
    'commercial',
    'Digital Advertisement',
    'Onionbulb Productions',
    'Media Production Artist / Production Specialist',
    null,
    'Contributed to multiple Kolin productions by supporting both pre-production and on-set requirements. My responsibilities included preparing set and prop requirements, coordinating talent and locations, assisting with production logistics, and supporting the team throughout shoot execution. Projects: Certus AI, Primus AI, Quad AI, Kolin AVP.',
    array[
      'Set Preparation', 'Props', 'Talent Coordination', 'Location Requirements',
      'Production Logistics', 'On-Set Support', 'Creative Collaboration'
    ],
    true, 10,
    '/images/placeholder-kolin.jpg',
    true
  ),
  (
    'eva-air',
    'EVA Air',
    'EVA AIR',
    'commercial',
    'Digital Advertisement',
    'Onionbulb Productions',
    'Media Production Artist / Production Specialist',
    null,
    'A fast-paced production that required continuous coordination between scenes. While one setup was being filmed, our production team simultaneously prepared the requirements for the succeeding scenes, making organization, communication, and adaptability essential throughout the shoot. I supported the production team with set preparation, props, logistics, and other on-set requirements to help maintain an efficient production flow.',
    null,
    true, 20,
    '/images/placeholder-evaair.jpg',
    true
  ),
  (
    'heys',
    'HEYS',
    'HEYS',
    'commercial',
    'Commercial Photoshoot',
    'Onionbulb Productions',
    'Media Production Artist / Production Specialist',
    null,
    'Supported the production of a seasonal commercial photoshoot featuring multiple visual setups. I assisted in preparing and organizing props, wardrobe, and set requirements for the different seasonal concepts while helping the team transition efficiently between setups.',
    array['Props', 'Wardrobe', 'Set Preparation', 'Production Support'],
    true, 30,
    '/images/placeholder-heys.jpg',
    true
  );

-- ----------------------------------------------------------------------------
-- projects — Digital OOH / LED (general capability placeholder)
--
-- No specific client project was given for this category yet — add real
-- Digital OOH projects from Admin → Projects → Create, using the
-- ooh_* fields (format, location, original/adapted material, live display).
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title, client, category, project_type, production_company, role, year,
   description, featured, sort_order, cover_image, published)
values
  (
    'digital-ooh-led',
    'LED / Digital OOH',
    null,
    'digital-ooh',
    'Digital Out-of-Home',
    'Onionbulb Productions',
    'Media Production Artist / Production Specialist',
    null,
    'In addition to production work, I edit, resize, and re-layout client-provided visual materials according to LED display specifications. I prepare and fit digital assets for various out-of-home formats, including gantry LEDs, standard LED billboards, and 3D digital billboards around BGC.',
    false, 40,
    '/images/placeholder-ooh.jpg',
    true
  );

-- ----------------------------------------------------------------------------
-- projects — Film (secondary to commercial work)
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title, client, category, project_type, production_company, role, year,
   description, featured, sort_order, cover_image, published)
values
  (
    'buboy',
    'Buboy',
    null,
    'film',
    'Short Film',
    'Sine Bulacan X',
    'Videographer',
    '2020',
    'Sine Bulacan X — Finalist.',
    false, 50,
    '/images/film-buboy-finalists.jpg',
    true
  ),
  (
    'dito',
    'Dito',
    null,
    'film',
    'Short Film',
    'Sine Bulacan XI',
    'Camera / Cinematography Team',
    '2023',
    'Sine Bulacan XI — Finalist.',
    false, 60,
    '/images/film-dito.jpg',
    true
  );

-- ----------------------------------------------------------------------------
-- projects — Photography: Film Photography category
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title, client, category, project_type, production_company, role, year,
   description, featured, sort_order, cover_image, gallery_images, published)
values
  (
    'film-photography',
    'Film Photography',
    null,
    'photography',
    'Film Photography',
    null,
    null,
    null,
    'Personal explorations shot primarily on the Yashica Electro 35 using different 35mm film stocks. Film photography has helped me develop a more deliberate approach to composition, timing, and observation.',
    false, 70,
    '/images/film-cityhall.jpg',
    array['/images/film-cityhall.jpg', '/images/film-jeepney.jpg', '/images/film-sax.jpg'],
    true
  );

-- ----------------------------------------------------------------------------
-- projects — Early Production Experience (When in Rizal, supporting projects)
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title, client, category, project_type, production_company, role, year,
   description, featured, sort_order, cover_image, published)
values
  (
    'abct-japanese-restaurant',
    'ABCT Japanese Restaurant',
    'ABCT Japanese Restaurant',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 80, '/images/internship-abct.jpg', true
  ),
  (
    'hill-house-dining',
    'Hill House Dining',
    'Hill House Dining',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 90, '/images/internship-hillhouse.jpg', true
  ),
  (
    'ucb-food-showcase',
    'UCB Food Showcase',
    'UCB',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 100, '/images/internship-ucb.jpg', true
  ),
  (
    'renatos-place',
    'Renato''s Place',
    'Renato''s Place',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 110, '/images/internship-renatos.jpg', true
  ),
  (
    'taktak-food-tour',
    'The Taktak Food Tour',
    'The Taktak Food Tour',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 120, '/images/internship-cyclist.jpg', true
  ),
  (
    'balaw-balaw-resto',
    'Balaw Balaw Resto',
    'Balaw Balaw Resto',
    'early-production',
    'Content Coverage',
    'When in Rizal',
    'Production Assistant Intern',
    null, null, false, 130, '/images/internship-balawbalaw.jpg', true
  );
