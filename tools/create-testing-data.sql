INSERT INTO treetracker.capture
(
reference_id, 
image_url, 
lat,
lon, 
gps_accuracy,
location,
planter_id,
planter_photo_url,
planter_username,
planting_organization_id,
device_identifier,
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
planter_id,
planter_photo_url,
'-',
planting_organization_id,
'-',
time_created,
now(),
ST_SetSRID( ST_Point( lon, lat), 4326)::geography,
'approved'
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
location,
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
location,
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


















