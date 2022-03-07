INSERT INTO treetracker.grower_account
  (
   wallet, 
   organization_id, 
   first_name, 
   last_name,
   email,
   phone,
   image_url,
   image_rotation,
   first_registration_at,
   lon,
   lat,
   location   
  )
SELECT DISTINCT ON ( COALESCE(planter.phone, planter.email) )
  COALESCE(planter.phone, planter.email), 
  entity.stakeholder_uuid,
  planter.first_name,
  planter.last_name,
  planter.email,
  planter.phone,
  COALESCE(planter.image_url, planter_photos.planter_photo_url, 'none'),
  COALESCE(planter.image_rotation, 0),
  planter_registration_record.created_at,
  planter_registration_record.lon,
  planter_registration_record.lat,
  planter_registration_record.geom
FROM planter
JOIN (
  SELECT DISTINCT ON (planter_id)
    planter_id, created_at, lat, lon, geom
  FROM planter_registrations
  ORDER BY planter_id, created_at DESC
) planter_registration_record
ON planter_registration_record.planter_id = planter.id
LEFT JOIN entity
ON entity.id = planter.organization_id
JOIN (
  SELECT DISTINCT ON (planter_id)
    planter_id, planter_photo_url
  FROM trees
  ORDER BY planter_id, time_created DESC
) planter_photos
ON planter_photos.planter_id = planter.id
WHERE 
  COALESCE(planter.phone, planter.email) NOT IN (
    SELECT wallet
    FROM treetracker.grower_account
  )
AND COALESCE(planter.phone, planter.email) IS NOT NULL
ORDER BY COALESCE(planter.phone, planter.email), planter_registration_record.created_at DESC

