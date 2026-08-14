import React from 'react';
import { Sprout, ShieldCheck, Users, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-app)', paddingBottom: '6rem' }}>
      
      {/* Hero Banner */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '4rem 0',
        marginBottom: '3.5rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--primary-300)' }}>
            Empowering Rural India
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: '800', marginBottom: '1rem', color: '#ffffff' }}>
            Rooted in Soil, Driven by Fairness
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            We are eliminating parasitic supply chains to connect hardworking regional farmers directly with conscious consumers.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Mission Card */}
        <div className="card" style={{ padding: '3rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            Our Mission & Core Philosophy
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            In traditional agricultural supply chains, farmers receive as little as 20% to 30% of the retail price you pay at the supermarket. The rest is consumed by multi-layered commission agents, transportation wholesalers, and retail markups — while crops spend days or weeks in transit, losing their vital nutrients.
          </p>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-body)', lineHeight: '1.8' }}>
            The <strong>Local Farmers Produce Direct-Selling Marketplace</strong> restores dignity and financial sustainability to farmers. By providing a direct digital platform, farmers set fair rates for their toil, and consumers receive farm-fresh harvest harvested within 24 hours.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '3.5rem'
        }}>
          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              100% Traceability
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Every product listing carries the farmer's name, farm location, and harvest time. Complete transparency in every bite.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#fff3e0', color: '#e65100', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Direct Farmer Prosperity
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              By bypassing middlemen, farmers earn up to 40% higher margins, fostering rural development and sustainable agriculture.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Unmatched Freshness
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Produce is harvested at dawn upon order confirmation and dispatched directly to your doorstep.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--primary-900)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)'
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem', color: '#ffffff' }}>
            Join Us in Reimagining Agriculture
          </h3>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '1.75rem', maxWidth: '600px', margin: '0 auto 1.75rem auto' }}>
            Whether you are a consumer seeking clean food or a grower wanting fair returns, there is a place for you in our community.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products">
              <Button variant="accent">Browse Farm Catalog</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
