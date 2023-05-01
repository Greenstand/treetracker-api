CREATE MATERIALIZED VIEW IF NOT EXISTS capture_tree_match
AS
    SELECT 
        tc.id, 
        count(tc.id) AS count 
    FROM 
    (
        capture tc 
        JOIN tree tt 
        ON (
            (
                st_dwithin(
                    tc.estimated_geographic_location, 
                    tt.estimated_geographic_location, 
                    (6):: double precision
                ) 
                AND 
                (tc.captured_at > (tt.created_at + '30 days' :: interval))
            )
        )
    ) 
    GROUP BY tc.id
WITH NO DATA;