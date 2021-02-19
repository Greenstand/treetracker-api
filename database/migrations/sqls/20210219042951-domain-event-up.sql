/* Replace with your SQL commands */
CREATE TABLE domain_event
(
    id uuid NOT NULL,
    payload jsonb NOT NULL,
    status varchar NOT NULL,
    retry_count smallint NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CONSTRAINT domain_event_pkey PRIMARY KEY (id, status, created_at)
) PARTITION BY LIST (status);

CREATE INDEX event_status_idx ON domain_event (status);
CREATE INDEX event_pyld_idx ON domain_event USING GIN (payload jsonb_path_ops);

CREATE TABLE domain_event_raised PARTITION OF domain_event FOR VALUES IN ('raised');
CREATE TABLE domain_event_received PARTITION OF domain_event FOR VALUES IN ('received');
CREATE TABLE domain_event_sent PARTITION OF domain_event FOR VALUES IN ('sent') PARTITION BY RANGE (created_at);
CREATE TABLE domain_event_handled PARTITION OF domain_event FOR VALUES IN ('handled') PARTITION BY RANGE (created_at);
CREATE TABLE domain_event_sent_2021 partition of domain_event_sent FOR VALUES FROM ('2021-01-01') TO ('2022-01-01');
CREATE TABLE domain_event_sent_2022 partition of domain_event_sent FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
CREATE TABLE domain_event_sent_2023 partition of domain_event_sent FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE domain_event_handled_2021 partition of domain_event_handled FOR VALUES FROM ('2021-01-01') TO ('2022-01-01');
CREATE TABLE domain_event_handled_2022 partition of domain_event_handled FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
CREATE TABLE domain_event_handled_2023 partition of domain_event_handled FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');