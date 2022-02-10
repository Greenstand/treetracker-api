
INSERT INTO treetracker.capture
(
reference_id, 
image_url, 
lat,
lon, 
gps_accuracy,
estimated_geometric_location,
grower_account_id,
grower_photo_url,
grower_username,
planting_organization_id,
device_configuration_id,
session_id,
created_at,
updated_at,
estimated_geographic_location,
status)
SELECT 
id, 
image_url,
lat,
lon,
gps_accuracy,
estimated_geometric_location,
'85fff895-33c8-4d89-a9b9-60b722beab60',
planter_photo_url,
'-',
uuid_generate_v4(),
uuid_generate_v4(),
uuid_generate_v4(),
time_created,
now(),
ST_SetSRID( ST_Point( lon, lat), 4326)::geography,
'active'
FROM trees
WHERE active = true
AND approved = true
AND image_url IS NOT NULL;



INSERT INTO treetracker.tree
(
latest_capture_id,
image_url,
lat,
lon,
estimated_geometric_location,
gps_accuracy,
species_id,
morphology,
age,
status,
created_at,
updated_at,
estimated_geographic_location
)
SELECT 
id,
image_url,
lat,
lon,
estimated_geometric_location,
gps_accuracy,
species_id,
morphology,
age,
status,
created_at,
updated_at,
estimated_geographic_location
FROM treetracker.capture
LIMIT 100;


















