--
-- PostgreSQL database dump
--

\restrict aG8kyhBLXfeYzQ84zuUh9IvWIjflPvbBNiSdhT29NcLeHhV6pxYSr6ASy9ReIsp

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sc_app; Type: SCHEMA; Schema: -; Owner: sc_migrate
--

CREATE SCHEMA sc_app;


ALTER SCHEMA sc_app OWNER TO sc_migrate;

--
-- Name: sc_ext; Type: SCHEMA; Schema: -; Owner: sc_migrate
--

CREATE SCHEMA sc_ext;


ALTER SCHEMA sc_ext OWNER TO sc_migrate;

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA sc_ext;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reservations; Type: TABLE; Schema: sc_app; Owner: sc_migrate
--

CREATE TABLE sc_app.reservations (
    reservation_id integer NOT NULL,
    room text NOT NULL,
    during tstzrange NOT NULL,
    CONSTRAINT reservations_during_check CHECK (((NOT isempty(during)) AND (NOT lower_inf(during)) AND (NOT upper_inf(during)) AND lower_inc(during) AND (NOT upper_inc(during))))
);


ALTER TABLE sc_app.reservations OWNER TO sc_migrate;

--
-- Data for Name: reservations; Type: TABLE DATA; Schema: sc_app; Owner: sc_migrate
--

COPY sc_app.reservations (reservation_id, room, during) FROM stdin;
7001	R1	["2026-11-02 10:00:00+00","2026-11-02 11:00:00+00")
\.


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: sc_app; Owner: sc_migrate
--

ALTER TABLE ONLY sc_app.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id);


--
-- Name: reservations room_free; Type: CONSTRAINT; Schema: sc_app; Owner: sc_migrate
--

ALTER TABLE ONLY sc_app.reservations
    ADD CONSTRAINT room_free EXCLUDE USING gist (room WITH =, during WITH &&);


--
-- Name: SCHEMA sc_app; Type: ACL; Schema: -; Owner: sc_migrate
--

GRANT USAGE ON SCHEMA sc_app TO sc_runtime;


--
-- Name: SCHEMA sc_ext; Type: ACL; Schema: -; Owner: sc_migrate
--

GRANT USAGE ON SCHEMA sc_ext TO sc_runtime;


--
-- Name: TABLE reservations; Type: ACL; Schema: sc_app; Owner: sc_migrate
--

GRANT SELECT,INSERT ON TABLE sc_app.reservations TO sc_runtime;


--
-- PostgreSQL database dump complete
--

\unrestrict aG8kyhBLXfeYzQ84zuUh9IvWIjflPvbBNiSdhT29NcLeHhV6pxYSr6ASy9ReIsp

